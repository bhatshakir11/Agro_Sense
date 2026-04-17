const fs = require("fs");
const path = require("path");

const mapPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@mediapipe",
  "tasks-vision",
  "vision_bundle_mjs.js.map"
);

const mapDir = path.dirname(mapPath);
const stubMap = {
  version: 3,
  file: "vision_bundle.mjs",
  sources: [],
  names: [],
  mappings: "",
};

try {
  if (!fs.existsSync(mapDir)) {
    process.exit(0);
  }

  if (!fs.existsSync(mapPath)) {
    fs.writeFileSync(mapPath, JSON.stringify(stubMap));
    console.log("Created missing MediaPipe source map stub.");
  }
} catch (error) {
  console.warn("Could not repair MediaPipe source map warning:", error.message);
}
