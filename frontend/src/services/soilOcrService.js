import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

async function renderPdfPagesAsImages(file, maxPages = 2) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = Math.min(pdf.numPages, maxPages);
  const images = [];

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    images.push(canvas.toDataURL("image/png"));
  }

  return images;
}

export async function extractTextFromScannedPdf(file) {
  const pageImages = await renderPdfPagesAsImages(file);
  const worker = await createWorker("eng");
  let combinedText = "";

  try {
    for (const pageImage of pageImages) {
      const result = await worker.recognize(pageImage);
      combinedText += ` ${result.data.text || ""}`;
    }
  } finally {
    await worker.terminate();
  }

  return combinedText.trim();
}
