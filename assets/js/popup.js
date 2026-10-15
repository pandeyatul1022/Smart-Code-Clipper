function normalizeLineNumber(number) {
  return number.replace(/^0+(?=\d)/, "");
}

function incrementLineNumber(number) {
  let digits = normalizeLineNumber(number).split("");
  let index = digits.length - 1;

  while (index >= 0 && digits[index] === "9") {
    digits[index] = "0";
    index -= 1;
  }

  if (index < 0) {
    digits.unshift("1");
  } else {
    digits[index] = String(Number(digits[index]) + 1);
  }

  return digits.join("");
}

function cleanNumberedLines(code, allowSingleLine) {
  let lines = code.split(/(\r\n|\n|\r)/);
  let numberedLines = [];

  for (let index = 0; index < lines.length; index += 2) {
    let line = lines[index];
    if (!line.trim()) continue;

    let match = line.match(/^([ \t]*)(?:\[(\d+)\][ \t]+|(\d+)(?:\.[ \t]+|:[ \t]+|\)[ \t]+|[ \t]+-[ \t]+|[ \t]+\|[ \t]+))/);
    if (!match) return code;

    numberedLines.push({
      lineIndex: index,
      number: normalizeLineNumber(match[2] || match[3]),
      prefixLength: match[0].length,
      indentationLength: match[1].length
    });
  }

  if (numberedLines.length === 0) return code;
  if (numberedLines.length === 1 && !allowSingleLine) return code;

  for (let index = 1; index < numberedLines.length; index += 1) {
    if (numberedLines[index].number !== incrementLineNumber(numberedLines[index - 1].number)) {
      return code;
    }
  }

  for (let numberedLine of numberedLines) {
    let line = lines[numberedLine.lineIndex];
    lines[numberedLine.lineIndex] =
      line.slice(0, numberedLine.indentationLength) +
      line.slice(numberedLine.prefixLength);
  }

  return lines.join("");
}

function removeLineNumbers() {
  let codeInput = document.getElementById("codeInput");
  let codeOutput = document.getElementById("codeOutput");
  let copyStatus = document.getElementById("copyStatus");
  let copyStatusText = document.getElementById("copyStatusText");
  let code = codeInput.value;
  let requestId = ++latestCopyRequest;
  clearTimeout(copyStatusTimer);
  copyStatus.hidden = true;

  let modifiedCode = cleanNumberedLines(
    code,
    document.getElementById("allowSingleLine").checked
  );

  // Update output textarea with modified code
  codeOutput.value = modifiedCode;

  // Copy modified code to clipboard
  navigator.clipboard.writeText(modifiedCode)
    .then(() => {
      if (requestId !== latestCopyRequest) return;
      if (!modifiedCode.trim()) {
        copyStatus.hidden = true;
        return;
      }
      copyStatus.dataset.state = "success";
      copyStatusText.textContent = "Copied!";
      copyStatus.hidden = false;
      copyStatusTimer = setTimeout(function() {
        if (requestId === latestCopyRequest) {
          copyStatus.hidden = true;
        }
      }, 1800);
    })
    .catch((error) => {
      console.error("Clipboard write failed:", error);
      if (requestId !== latestCopyRequest) return;
      copyStatus.dataset.state = "error";
      copyStatusText.textContent = "Copy failed. Please try again.";
      copyStatus.hidden = false;
    });
}

let latestCopyRequest = 0;
let copyStatusTimer;

document.addEventListener("DOMContentLoaded", function() {
  let themeToggle = document.getElementById("themeToggle");
  let savedTheme = localStorage.getItem("theme");
  let currentTheme = savedTheme === "dark" ? "dark" : "light";

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    let actionLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    themeToggle.setAttribute("aria-label", actionLabel);
    themeToggle.setAttribute("title", actionLabel);
  }

  applyTheme(currentTheme);
  themeToggle.addEventListener("click", function() {
    let nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });

  let codeInput = document.getElementById("codeInput");
  let singleLineToggle = document.getElementById("allowSingleLine");
  singleLineToggle.checked = localStorage.getItem("allowSingleLine") === "true";
  singleLineToggle.addEventListener("change", function() {
    localStorage.setItem("allowSingleLine", String(singleLineToggle.checked));
    if (codeInput.value) removeLineNumbers();
  });

  codeInput.focus();
  codeInput.addEventListener("input", removeLineNumbers);
});
