const pdfParse = require("pdf-parse");
const { extractFieldsFromText } = require("./soilTextParser");

function getFriendlyPdfError(error) {
  const message = String(error.message || "").toLowerCase();

  if (message.includes("bad xref") || message.includes("xref")) {
    return "This PDF has an unsupported or damaged internal structure. Export the soil report again as a clean PDF and try once more.";
  }

  if (message.includes("invalid pdf")) {
    return "The uploaded file is not being recognized as a valid PDF.";
  }

  return "Unable to read this PDF. If it is a scanned image PDF, OCR support is still needed.";
}

async function parseSoilPdf(base64Data) {
  const buffer = Buffer.from(base64Data, "base64");

  let parsed;

  try {
    parsed = await pdfParse(buffer);
  } catch (error) {
    throw new Error(getFriendlyPdfError(error));
  }

  if (!parsed.text || !parsed.text.trim()) {
    throw new Error(
      "This PDF does not contain readable text. It may be a scanned image PDF, which the current parser cannot analyze yet."
    );
  }

  const extraction = extractFieldsFromText(parsed.text || "");

  return {
    text: parsed.text || "",
    extracted: extraction.extracted,
    missing: extraction.missing,
  };
}

module.exports = {
  parseSoilPdf,
  extractFieldsFromText,
};
