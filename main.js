/**
 * @param {string} text
 * @param {number} row
 * @param {number} col
 * @param {number} [zIndex]
 * @returns {HTMLDivElement}
 */
function createCell(text, row, col, zIndex) {
  const cell = document.createElement("div");
  cell.textContent = text;
  cell.style.gridRow = row.toString();
  if (text.length > 1) {
    cell.style.gridColumn = `${col} / ${col + text.length}`;
    cell.style.textAlign = "center";
  } else {
    cell.style.gridColumn = col.toString();
  }
  if (zIndex !== undefined) {
    cell.style.zIndex = zIndex.toString();
    cell.style.backgroundColor = "var(--blue)";
  }
  return cell;
}

/**
 * @returns {{cols: number, rows: number}}
 */
function getGridDimensions() {
  const container = document.querySelector(".grid-container");
  const computedStyle = window.getComputedStyle(container);
  const cols = computedStyle.getPropertyValue("grid-template-columns").split(
    " ",
  ).length;
  const rows = computedStyle.getPropertyValue("grid-template-rows").split(
    " ",
  ).length;
  return { cols, rows };
}

/**
 * @typedef {1 | 2 | 3 | 4 | 5} Score
 * @typedef {{score: Score, label: string, languages: string[]}} Rating
 */

/** @type {Rating[]} */
const ratings = [
  { score: 5, label: "Amazing", languages: ["Gleam", "ReasonML"] },
  { score: 4, label: "Good", languages: ["Go"] },
  { score: 3, label: "Mid", languages: ["JavaScript"] },
  { score: 2, label: "Bad", languages: ["Python", "Elixir", "TypeScript"] },
  { score: 1, label: "Terrible", languages: ["C++"] },
];

/**
 * @param {HTMLElement} container
 * @param {number} cols
 * @param {number} rows
 */
function drawRatings(container, cols, rows) {
  const startRow = 3;
  const startCol = 4;

  // Calculate max width for score labels
  const maxLabelWidth = Math.max(
    ...ratings.map((r) => `[${r.score}] ${r.label}`.length),
  );
  const separatorCol = startCol + maxLabelWidth + 1;

  // Ratings
  let currentRow = startRow;
  let visibleCount = 0;

  ratings.forEach((rating) => {
    if (currentRow > rows - 2) return;
    visibleCount++;

    // Score and label
    const scoreLabel = `[${rating.score}] ${rating.label}`;
    const scoreLabelCell = createCell(scoreLabel, currentRow, startCol, 2);

    // Color based on score
    switch (rating.score) {
      case 5:
        scoreLabelCell.style.color = "var(--bright-green)";
        break;
      case 4:
        scoreLabelCell.style.color = "var(--green)";
        break;
      case 3:
        scoreLabelCell.style.color = "var(--bright-yellow)";
        break;
      case 2:
        scoreLabelCell.style.color = "var(--yellow)";
        break;
      case 1:
        scoreLabelCell.style.color = "var(--bright-red)";
        break;
      default:
        /** @type {never} */
        const _exhaustive = rating.score;
        throw new Error(`Unexpected score: ${_exhaustive}`);
    }
    container.appendChild(scoreLabelCell);

    // Languages
    const languagesText = rating.languages.join(" • ");
    const langCol = separatorCol + 2;
    if (langCol + languagesText.length < cols - 1) {
      const langCell = createCell(languagesText, currentRow, langCol);
      langCell.style.color = "var(--white)";
      container.appendChild(langCell);
    }

    // Draw vertical separator for this row
    const lineCell = createCell("│", currentRow, separatorCol);
    lineCell.style.color = "var(--white)";
    container.appendChild(lineCell);

    // Draw line between rows (except after last row)
    if (visibleCount < ratings.length && currentRow + 2 <= rows - 2) {
      const betweenLineCell = createCell("│", currentRow + 1, separatorCol);
      betweenLineCell.style.color = "var(--white)";
      container.appendChild(betweenLineCell);
    }

    currentRow += 2;
  });
}

/**
 * @returns {void}
 */
function redrawBox() {
  /** @type {HTMLElement} */
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";

  // Place corner elements first to let grid determine dimensions
  container.appendChild(createCell("╔", 1, 1));
  container.appendChild(createCell("╗", 1, -1));
  container.appendChild(createCell("╚", -1, 1));
  container.appendChild(createCell("╝", -1, -1));

  // Get actual grid dimensions
  const { cols, rows } = getGridDimensions();

  // Top row - complete border
  for (let col = 2; col < cols; col++) {
    container.appendChild(createCell("═", 1, col));
  }

  // Title overlay
  const title = " kubascale.com ";
  const titleStart = Math.floor((cols - title.length) / 2) + 1;
  const titleCell = createCell(title, 1, titleStart, 1);
  titleCell.style.backgroundColor = "var(--white)";
  titleCell.style.color = "var(--blue)";
  container.appendChild(titleCell);

  // Middle rows - just the sides
  for (let row = 2; row < rows; row++) {
    container.appendChild(createCell("║", row, 1));
    container.appendChild(createCell("║", row, -1));
  }

  // Bottom row
  for (let col = 2; col < cols; col++) {
    container.appendChild(createCell("═", -1, col));
  }

  // Add rating content
  drawRatings(container, cols, rows);
}

// Initial draw
redrawBox();

// Redraw on window resize
window.addEventListener("resize", redrawBox);
