function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let tooLarge = false;

    request.on("data", (chunk) => {
      if (tooLarge) {
        return;
      }

      body += chunk.toString();

      if (body.length > 15 * 1024 * 1024) {
        tooLarge = true;
      }
    });

    request.on("end", () => {
      if (tooLarge) {
        const error = new Error(
          "Uploaded image is too large. Try a smaller image or a compressed photo."
        );
        error.statusCode = 413;
        reject(error);
        return;
      }

      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = {
  readJsonBody,
};
