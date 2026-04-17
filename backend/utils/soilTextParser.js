const NUMBER_CAPTURE = "([0-9][0-9oO]*(?:[.,][0-9oO]+)?)";

const FIELD_DEFINITIONS = {
  Nitrogen: {
    patterns: [
      new RegExp(`available\\s+nitrogen\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`nitrogen(?:\\s*\\(n\\))?\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
    ],
    labelPatterns: [/available\s+nitrogen/i, /nitrogen/i, /nitrogen\s*\(n\)/i],
    range: { min: 0, max: 1000 },
    searchAfter: 120,
  },
  Phosphorus: {
    patterns: [
      new RegExp(`available\\s+phosphorus\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`phosphorus(?:\\s*\\(p\\))?\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
    ],
    labelPatterns: [/available\s+phosphorus/i, /phosphorus/i, /phosphorus\s*\(p\)/i],
    range: { min: 0, max: 500 },
    searchAfter: 120,
  },
  Potassium: {
    patterns: [
      new RegExp(`available\\s+potassium\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`potassium(?:\\s*\\(k\\))?\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
    ],
    labelPatterns: [/available\s+potassium/i, /potassium/i, /potassium\s*\(k\)/i],
    range: { min: 0, max: 1000 },
    searchAfter: 120,
  },
  pH: {
    patterns: [
      new RegExp(`\\bp\\s*\\.?\\s*h\\b(?:\\s*\\([^)]*\\))?\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`soil\\s+reaction(?:\\s*\\([^)]*\\))?\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`reaction\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`\\bph\\b\\s*${NUMBER_CAPTURE}`, "i"),
    ],
    labelPatterns: [
      /\bph\b/i,
      /\bp\s*\.?\s*h\b/i,
      /\bsoil\s+ph\b/i,
      /soil\s+reaction/i,
      /\bpi[-\s]?h\b/i,
      /\bp1[-\s]?h\b/i,
    ],
    range: { min: 0, max: 14 },
    searchAfter: 80,
  },
  "Organic Carbon": {
    patterns: [
      new RegExp(`organic\\s+carbon\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
      new RegExp(`\\boc\\b\\s*[:\\-]?\\s*${NUMBER_CAPTURE}`, "i"),
    ],
    labelPatterns: [/organic\s+carbon/i, /\boc\b/i],
    range: { min: 0, max: 10 },
    searchAfter: 120,
  },
};

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[|]/g, " ")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\bp\s+h\b/gi, "pH")
    .replace(/\bp\s*\.?\s*h\b/gi, "pH")
    .replace(/\bpi[-\s]?h\b/gi, "pH")
    .replace(/\bp1[-\s]?h\b/gi, "pH")
    .replace(/\bpl[-\s]?h\b/gi, "pH");
}

function parseExtractedNumber(rawValue) {
  return Number(String(rawValue).replace(/,/g, ".").replace(/[oO]/g, "0"));
}

function isWithinRange(value, range) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return false;
  }

  if (!range) {
    return true;
  }

  return value >= range.min && value <= range.max;
}

function normalizeNumericToken(token) {
  if (!/\d/.test(token)) {
    return null;
  }

  const cleaned = token
    .replace(/[oO](?=\d)/g, "0")
    .replace(/(?<=\d)[oO]/g, "0")
    .replace(/,/g, ".");

  const match = cleaned.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function findNumericTokens(line) {
  return line
    .split(/\s+/)
    .map((token) => token.replace(/^[^0-9]+|[^0-9a-zA-Z.,%-]+$/g, ""))
    .map(normalizeNumericToken)
    .filter((value) => value !== null && !Number.isNaN(value));
}

function extractFromLineByLabel(line, fieldDefinition) {
  const hasLabel = fieldDefinition.labelPatterns.some((pattern) => pattern.test(line));

  if (!hasLabel) {
    return null;
  }

  const values = findNumericTokens(line).filter((value) => isWithinRange(value, fieldDefinition.range));
  return values.length > 0 ? values[0] : null;
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTextWindow(text, startIndex, endIndex, searchAfter) {
  const beforeStart = Math.max(0, startIndex - 24);
  const afterEnd = Math.min(text.length, endIndex + searchAfter);
  return text.slice(beforeStart, afterEnd);
}

function extractValueNearLabel(text, fieldDefinition) {
  for (const labelPattern of fieldDefinition.labelPatterns) {
    const flags = labelPattern.flags.includes("g")
      ? labelPattern.flags
      : `${labelPattern.flags}g`;
    const globalPattern = new RegExp(labelPattern.source, flags);
    let match = globalPattern.exec(text);

    while (match) {
      const labelText = match[0];
      const labelStart = match.index;
      const labelEnd = labelStart + labelText.length;
      const windowText = getTextWindow(text, labelStart, labelEnd, fieldDefinition.searchAfter);
      const windowStart = Math.max(0, labelStart - 24);
      const lineAfterLabel = text
        .slice(labelEnd, Math.min(text.length, labelEnd + fieldDefinition.searchAfter))
        .split("\n")[0];

      const patterns = [
        new RegExp(`${escapeForRegex(labelText)}[^0-9\\n]{0,30}${NUMBER_CAPTURE}`, "i"),
        new RegExp(`${escapeForRegex(labelText)}(?:\\s+value)?[^0-9\\n]{0,30}${NUMBER_CAPTURE}`, "i"),
      ];

      for (const pattern of patterns) {
        const inlineMatch = windowText.match(pattern);
        if (inlineMatch) {
          const candidate = parseExtractedNumber(inlineMatch[1]);
          if (isWithinRange(candidate, fieldDefinition.range)) {
            return candidate;
          }
        }
      }

      const rowCandidate = findNumericTokens(lineAfterLabel).find((value) =>
        isWithinRange(value, fieldDefinition.range)
      );

      if (rowCandidate !== undefined) {
        return rowCandidate;
      }

      const windowCandidates = [];
      const numberPattern = /\d[\doO]*(?:[.,][\doO]+)?/g;
      let numberMatch = numberPattern.exec(windowText);

      while (numberMatch) {
        const candidate = parseExtractedNumber(numberMatch[0]);
        const candidateIndex = windowStart + numberMatch.index;

        if (
          candidateIndex >= labelStart - 8 &&
          candidateIndex <= labelEnd + fieldDefinition.searchAfter &&
          isWithinRange(candidate, fieldDefinition.range)
        ) {
          windowCandidates.push({
            value: candidate,
            distance: Math.abs(candidateIndex - labelEnd),
          });
        }

        numberMatch = numberPattern.exec(windowText);
      }

      if (windowCandidates.length > 0) {
        windowCandidates.sort((left, right) => left.distance - right.distance);
        return windowCandidates[0].value;
      }

      match = globalPattern.exec(text);
    }
  }

  return null;
}

function extractFieldsFromText(text) {
  const normalizedText = normalizeText(text);
  const normalizedLines = normalizedText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const extracted = {};
  const missing = [];

  Object.entries(FIELD_DEFINITIONS).forEach(([fieldName, fieldDefinition]) => {
    const lineMatch = normalizedLines
      .map((line) => extractFromLineByLabel(line, fieldDefinition))
      .find((value) => value !== null && !Number.isNaN(value));

    if (lineMatch !== undefined && lineMatch !== null) {
      extracted[fieldName] = lineMatch;
      return;
    }

    const wholeTextMatch = fieldDefinition.patterns
      .map((pattern) => normalizedText.match(pattern))
      .find(Boolean);

    if (wholeTextMatch) {
      const candidate = parseExtractedNumber(wholeTextMatch[1]);
      if (isWithinRange(candidate, fieldDefinition.range)) {
        extracted[fieldName] = candidate;
        return;
      }
    }

    const neighborhoodMatch = extractValueNearLabel(normalizedText, fieldDefinition);

    if (neighborhoodMatch !== null && neighborhoodMatch !== undefined) {
      extracted[fieldName] = neighborhoodMatch;
      return;
    }

    missing.push(fieldName);
  });

  return {
    extracted,
    missing,
  };
}

module.exports = {
  extractFieldsFromText,
};
