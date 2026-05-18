function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildScene({ background, foreground, accent, title, body }) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${background[0]}" />
          <stop offset="100%" stop-color="${background[1]}" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${foreground[0]}" />
          <stop offset="100%" stop-color="${foreground[1]}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="560" fill="url(#bg)" />
      <circle cx="170" cy="96" r="92" fill="${accent}" opacity="0.24" />
      <circle cx="1030" cy="88" r="110" fill="#ffffff" opacity="0.1" />
      <rect y="340" width="1200" height="220" fill="url(#ground)" />
      <path d="M0 360 C180 320 300 392 470 350 C650 315 780 398 935 354 C1035 326 1110 338 1200 360 L1200 560 L0 560 Z" fill="${foreground[2]}" opacity="0.95" />
      ${body}
      <rect x="48" y="36" width="220" height="46" rx="23" fill="rgba(255,255,255,0.2)" />
      <text x="158" y="67" text-anchor="middle" fill="#ffffff" font-size="24" font-family="Arial, sans-serif" letter-spacing="4">CROP VISUAL</text>
      <rect x="54" y="454" width="300" height="70" rx="24" fill="rgba(16,42,26,0.28)" />
      <text x="82" y="502" fill="#ffffff" font-size="64" font-weight="700" font-family="Arial, sans-serif">${title}</text>
    </svg>
  `);
}

function buildCropIllustration(label, key) {
  const scenes = {
    wheat: buildScene({
      background: ["#d8e6b3", "#f4d889"],
      foreground: ["#7c9d34", "#536f1f", "#a77c2f"],
      accent: "#fff3a0",
      title: "Wheat",
      body: `
        ${Array.from({ length: 9 })
          .map((_, index) => {
            const x = 140 + index * 105;
            const h = 170 + (index % 3) * 35;
            return `
              <rect x="${x}" y="${470 - h}" width="10" height="${h}" rx="6" fill="#507a22" />
              <ellipse cx="${x + 6}" cy="${290 - (index % 2) * 18}" rx="18" ry="58" fill="#e2c25b" transform="rotate(${index % 2 ? -10 : 12} ${x + 6} ${290 - (index % 2) * 18})" />
            `;
          })
          .join("")}
      `,
    }),
    rice: buildScene({
      background: ["#b9e7dc", "#dff9ec"],
      foreground: ["#63a85e", "#3f8640", "#8fcf74"],
      accent: "#cffff4",
      title: "Rice",
      body: `
        <rect x="0" y="470" width="1200" height="180" fill="#91d9e6" opacity="0.55" />
        ${Array.from({ length: 10 })
          .map((_, index) => {
            const x = 100 + index * 100;
            return `
              <path d="M${x} 520 Q${x + 28} 360 ${x + 40} 250" stroke="#2f7d39" stroke-width="10" fill="none" stroke-linecap="round" />
              <ellipse cx="${x + 48}" cy="255" rx="18" ry="62" fill="#e8d985" transform="rotate(18 ${x + 48} 255)" />
            `;
          })
          .join("")}
      `,
    }),
    maize: buildScene({
      background: ["#d1ee89", "#f5ec98"],
      foreground: ["#4b8a38", "#356b24", "#7fbf48"],
      accent: "#f7ffbf",
      title: "Maize",
      body: `
        ${[220, 420, 620, 820, 1020]
          .map(
            (x) => `
              <rect x="${x}" y="245" width="14" height="270" rx="8" fill="#2c7c35" />
              <ellipse cx="${x - 26}" cy="386" rx="34" ry="118" fill="#5ca94d" transform="rotate(-28 ${x - 26} 386)" />
              <ellipse cx="${x + 42}" cy="360" rx="36" ry="128" fill="#76be5e" transform="rotate(28 ${x + 42} 360)" />
              <rect x="${x - 8}" y="336" width="48" height="106" rx="24" fill="#f0d04e" />
            `
          )
          .join("")}
      `,
    }),
    cotton: buildScene({
      background: ["#cfe3c0", "#eef5dc"],
      foreground: ["#7aa15a", "#4f6b38", "#bd9464"],
      accent: "#ffffff",
      title: "Cotton",
      body: `
        ${[220, 430, 640, 850]
          .map(
            (x, index) => `
              <rect x="${x}" y="290" width="12" height="220" rx="7" fill="#57793c" />
              <path d="M${x + 6} 370 C${x - 30} 350 ${x - 50} 330 ${x - 58} 300" stroke="#57793c" stroke-width="8" fill="none" stroke-linecap="round" />
              <path d="M${x + 6} 400 C${x + 44} 382 ${x + 66} 352 ${x + 78} 320" stroke="#57793c" stroke-width="8" fill="none" stroke-linecap="round" />
              <circle cx="${x - 64}" cy="292" r="32" fill="#ffffff" />
              <circle cx="${x + 84}" cy="312" r="34" fill="#ffffff" />
              <circle cx="${x + 20}" cy="240" r="38" fill="#ffffff" />
              <circle cx="${x - 64}" cy="292" r="12" fill="#7b5b3d" />
              <circle cx="${x + 84}" cy="312" r="12" fill="#7b5b3d" />
              <circle cx="${x + 20}" cy="240" r="12" fill="#7b5b3d" />
            `
          )
          .join("")}
      `,
    }),
    sugarcane: buildScene({
      background: ["#bde6a0", "#e6f8cf"],
      foreground: ["#619f47", "#3e7c31", "#77b95d"],
      accent: "#d4ffd1",
      title: "Sugarcane",
      body: `
        ${[220, 360, 500, 640, 780, 920]
          .map(
            (x, index) => `
              <rect x="${x}" y="${220 + (index % 2) * 20}" width="34" height="300" rx="14" fill="${index % 2 ? "#76c66b" : "#64b85e"}" />
              <line x1="${x}" y1="290" x2="${x + 34}" y2="290" stroke="#dff8d4" stroke-width="8" />
              <line x1="${x}" y1="370" x2="${x + 34}" y2="370" stroke="#dff8d4" stroke-width="8" />
              <line x1="${x}" y1="450" x2="${x + 34}" y2="450" stroke="#dff8d4" stroke-width="8" />
            `
          )
          .join("")}
        ${[260, 540, 830]
          .map(
            (x) => `
              <path d="M${x} 230 Q${x - 70} 170 ${x - 100} 110" stroke="#4d943b" stroke-width="10" fill="none" stroke-linecap="round" />
              <path d="M${x} 230 Q${x + 70} 170 ${x + 100} 110" stroke="#4d943b" stroke-width="10" fill="none" stroke-linecap="round" />
            `
          )
          .join("")}
      `,
    }),
    soybean: buildScene({
      background: ["#dce7a9", "#f2f5ce"],
      foreground: ["#6e9b46", "#486928", "#8db567"],
      accent: "#f7ffd0",
      title: "Soybean",
      body: `
        ${[220, 430, 640, 850]
          .map(
            (x) => `
              <rect x="${x}" y="300" width="12" height="210" rx="6" fill="#4e7d2f" />
              <ellipse cx="${x - 46}" cy="346" rx="30" ry="94" fill="#7ab65d" transform="rotate(-35 ${x - 46} 346)" />
              <ellipse cx="${x + 56}" cy="334" rx="30" ry="94" fill="#89c96b" transform="rotate(35 ${x + 56} 334)" />
              <ellipse cx="${x + 12}" cy="258" rx="24" ry="70" fill="#9cbe58" transform="rotate(92 ${x + 12} 258)" />
            `
          )
          .join("")}
      `,
    }),
    groundnut: buildScene({
      background: ["#ead2a7", "#f8edd0"],
      foreground: ["#9f784f", "#6f4f31", "#b38b60"],
      accent: "#fff4d2",
      title: "Groundnut",
      body: `
        ${[230, 410, 590, 770, 950]
          .map(
            (x, index) => `
              <path d="M${x} 260 Q${x + 10} 350 ${x} 460" stroke="#5f7f39" stroke-width="10" fill="none" stroke-linecap="round" />
              <ellipse cx="${x - 20}" cy="${470 + (index % 2) * 8}" rx="34" ry="24" fill="#c69a64" />
              <ellipse cx="${x + 20}" cy="${470 - (index % 2) * 8}" rx="34" ry="24" fill="#b98853" />
            `
          )
          .join("")}
      `,
    }),
    "pearl-millet": buildScene({
      background: ["#d6e58e", "#efe3a6"],
      foreground: ["#6b983f", "#466a27", "#9f884e"],
      accent: "#f8f2b2",
      title: "Pearl Millet",
      body: `
        ${[180, 330, 480, 630, 780, 930]
          .map(
            (x, index) => `
              <rect x="${x}" y="${300 - (index % 2) * 30}" width="12" height="220" rx="6" fill="#4f7c2d" />
              <ellipse cx="${x + 8}" cy="${270 - (index % 2) * 20}" rx="24" ry="86" fill="#b8a35b" />
            `
          )
          .join("")}
      `,
    }),
    tomato: buildScene({
      background: ["#c9e9b0", "#eef8db"],
      foreground: ["#6fa257", "#487331", "#90c273"],
      accent: "#fdf0f0",
      title: "Tomato",
      body: `
        ${[230, 420, 610, 800, 990]
          .map(
            (x) => `
              <path d="M${x} 245 C${x - 25} 320 ${x - 20} 410 ${x} 500" stroke="#4f7f31" stroke-width="10" fill="none" stroke-linecap="round" />
              <path d="M${x} 310 C${x + 30} 340 ${x + 46} 370 ${x + 62} 408" stroke="#4f7f31" stroke-width="8" fill="none" stroke-linecap="round" />
              <circle cx="${x + 72}" cy="428" r="36" fill="#e24c40" />
              <circle cx="${x - 28}" cy="388" r="34" fill="#d93f33" />
              <polygon points="${x + 72},392 ${x + 84},410 ${x + 106},412 ${x + 90},426 ${x + 94},448 ${x + 72},438 ${x + 50},448 ${x + 54},426 ${x + 38},412 ${x + 60},410" fill="#4e8a38" />
            `
          )
          .join("")}
      `,
    }),
    potato: buildScene({
      background: ["#cce0a9", "#f2eed0"],
      foreground: ["#8c724a", "#66512f", "#a3865e"],
      accent: "#f7f3de",
      title: "Potato",
      body: `
        ${[220, 430, 640, 850]
          .map(
            (x) => `
              <path d="M${x} 260 C${x - 14} 330 ${x - 4} 410 ${x} 470" stroke="#5d8a39" stroke-width="10" fill="none" stroke-linecap="round" />
              <ellipse cx="${x - 18}" cy="492" rx="42" ry="30" fill="#b18a54" />
              <ellipse cx="${x + 30}" cy="478" rx="38" ry="28" fill="#a87f4a" />
              <ellipse cx="${x + 74}" cy="502" rx="38" ry="28" fill="#b58e59" />
            `
          )
          .join("")}
      `,
    }),
  };

  return scenes[key] || buildScene({
    background: ["#d9e7c0", "#f3f7e8"],
    foreground: ["#7ca55c", "#4e6e3b", "#91bd72"],
    accent: "#ffffff",
    title: label,
    body: `
      <circle cx="410" cy="360" r="86" fill="#ffffff" opacity="0.18" />
      <circle cx="610" cy="300" r="62" fill="#ffffff" opacity="0.14" />
      <circle cx="790" cy="390" r="78" fill="#ffffff" opacity="0.16" />
    `,
  });
}

function normalizeCropKey(cropName = "") {
  return String(cropName).trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function titleCaseCrop(cropName = "Crop") {
  return String(cropName)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCropMedia(cropName) {
  const key = normalizeCropKey(cropName);
  const label = titleCaseCrop(cropName);

  return {
    image: buildCropIllustration(label, key),
    alt: `${label} visual`,
    placeholder: false,
    label,
  };
}

export function getCropImage(cropName) {
  return getCropMedia(cropName).image;
}
