const https = require("https");

function getJson(url, options = {}) {
  return getText(url, options).then((body) => {
    try {
      return JSON.parse(body);
    } catch (error) {
      throw new Error("Invalid JSON response from upstream service");
    }
  });
}

function getText(url, options = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, options, (response) => {
        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Request failed with status ${response.statusCode}`));
            return;
          }

          resolve(body);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = {
  getJson,
  getText,
};
