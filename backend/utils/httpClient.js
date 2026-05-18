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

function postJson(url, payload, options = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const target = new URL(url);
    const timeoutMs = options.timeoutMs || 30000;

    const request = https.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || 443,
        path: `${target.pathname}${target.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...(options.headers || {}),
        },
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(
              new Error(
                responseBody || `Request failed with status ${response.statusCode}`
              )
            );
            return;
          }

          try {
            resolve(JSON.parse(responseBody));
          } catch (error) {
            reject(new Error("Invalid JSON response from upstream service"));
          }
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });

    request.write(body);
    request.end();
  });
}

module.exports = {
  getJson,
  getText,
  postJson,
};
