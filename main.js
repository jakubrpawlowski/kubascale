/**
 * @param {string} char
 * @param {number} row
 * @param {number} col
 * @returns {HTMLDivElement}
 */
function createCell(char, row, col) {
  const cell = document.createElement("div");
  cell.textContent = char;
  cell.style.gridRow = row.toString();
  cell.style.gridColumn = col.toString();
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
 * @returns {void}
 */
function redrawBox() {
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";

  // Place corner elements first to let grid determine dimensions
  container.appendChild(createCell("╔", 1, 1));
  container.appendChild(createCell("╗", 1, -1));
  container.appendChild(createCell("╚", -1, 1));
  container.appendChild(createCell("╝", -1, -1));

  // Get actual grid dimensions
  const { cols, rows } = getGridDimensions();

  // Calculate the text "kubascale.com" and its position
  const title = "kubascale.com";
  const titleStart = Math.floor((cols - title.length) / 2);

  // Top row
  for (let col = 2; col < cols; col++) {
    if (col >= titleStart && col < titleStart + title.length) {
      container.appendChild(
        createCell(title[col - titleStart], 1, col),
      );
    } else {
      container.appendChild(createCell("═", 1, col));
    }
  }

  // Middle rows - just the sides
  for (let row = 2; row < rows; row++) {
    container.appendChild(createCell("║", row, 1));
    container.appendChild(createCell("║", row, -1));
  }

  // Bottom row
  for (let col = 2; col < cols; col++) {
    container.appendChild(createCell("═", -1, col));
  }
}

// Initial draw
redrawBox();

// Redraw on window resize
window.addEventListener("resize", redrawBox);
