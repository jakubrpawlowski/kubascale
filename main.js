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

// Store the initial content area HTML
let contentAreaHTML = "";

/**
 * @returns {void}
 */
function redrawBox() {
  /** @type {HTMLElement} */
  const container = document.querySelector(".grid-container");

  // Save content area HTML on first run
  if (!contentAreaHTML) {
    const contentArea = container.querySelector(".content-area");
    if (contentArea) {
      contentAreaHTML = contentArea.outerHTML;
    }
  }

  // Clear everything
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

  // Re-add the content area
  if (contentAreaHTML) {
    container.insertAdjacentHTML("beforeend", contentAreaHTML);
  }
}

// Initial draw
redrawBox();

// Redraw on window resize
window.addEventListener("resize", redrawBox);
