const gameContainer = document.getElementById("gameContainer");
const movesCount = document.getElementById("moves");
const popup = document.querySelector(".popup");
let moves = 0;

let gameState = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, ""],
];

function shuffleCells() {
  moves = 0;
  const flattenedArray = gameState.flat();
  for (let i = flattenedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flattenedArray[i], flattenedArray[j]] = [
      flattenedArray[j],
      flattenedArray[i],
    ];
  }

  const shuffledArray = [];
  while (flattenedArray.length) {
    shuffledArray.push(flattenedArray.splice(0, gameState[0].length));
  }

  gameState = shuffledArray;

  initCells();
}

function checkValidCell(event) {
  let id = parseInt(event.target.dataset.tag);
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      if (gameState[i][j] === id) {
        if (gameState[i][j - 1] === "") {
          return { valid: true, currentCell: [i, j], emptyCell: [i, j - 1] };
        } else if (gameState[i][j + 1] === "") {
          return { valid: true, currentCell: [i, j], emptyCell: [i, j + 1] };
        } else if (gameState[i - 1] && gameState[i - 1][j] === "") {
          return { valid: true, currentCell: [i, j], emptyCell: [i - 1, j] };
        } else if (gameState[i + 1] && gameState[i + 1][j] === "") {
          return { valid: true, currentCell: [i, j], emptyCell: [i + 1, j] };
        }
      }
    }
  }
  return { valid: false };
}

function checkWin() {
  if (gameState[gameState.length - 1][gameState[0].length - 1] !== "") {
    return false;
  }

  let lastNum = 0;
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      if (lastNum > gameState[i][j] && gameState[i][j] !== "") {
        return false;
      }
      lastNum = gameState[i][j];
    }
  }
  return true;
}

function handleCellClick(event) {
  const { valid, currentCell, emptyCell } = checkValidCell(event);
  if (valid) {
    moves++;
    const emptyElem = document.querySelector(".empty-cell");

    // swap the element with the empty cell
    [
      gameState[currentCell[0]][currentCell[1]],
      gameState[emptyCell[0]][emptyCell[1]],
    ] = [
      gameState[emptyCell[0]][emptyCell[1]],
      gameState[currentCell[0]][currentCell[1]],
    ];

    event.target.style.gridRow = `${emptyCell[0] + 1} / span 1`;
    event.target.style.gridColumn = `${emptyCell[1] + 1} / span 1`;

    emptyElem.style.gridRow = `${currentCell[0] + 1} / span 1`;
    emptyElem.style.gridColumn = `${currentCell[1] + 1} / span 1`;

    const winStatus = checkWin();
    if (winStatus) {
      movesCount.innerText = moves;
      popup.classList.remove("hidden");
    }
  }
}

function addBorder(event) {
  if (checkValidCell(event).valid) {
    event.target.classList.add("movablepiece");
  }
}

function removeBorder(event) {
  event.target.classList.remove("movablepiece");
}

function createCell(n) {
  let cell = document.createElement("div");
  cell.id = `cell-${Number(n) ? n : 16}`;
  cell.dataset.tag = n;
  cell.classList.add("game-cell");
  cell.innerHTML = `<p>${n}</p>`;

  if (Number(n)) {
    cell.addEventListener("click", handleCellClick);
    cell.addEventListener("mouseover", addBorder);
    cell.addEventListener("mouseout", removeBorder);
  } else {
    cell.classList.add("empty-cell");
  }

  return cell;
}

function initCells() {
  gameContainer.innerHTML = "";
  const cellHtml = [];
  gameState.forEach((row) => {
    row.forEach((cell) => {
      cellHtml.push(createCell(cell));
    });
  });

  gameContainer.append(...cellHtml);
}

function main() {
  const shuffleBtn = document.querySelector(".shuffle-btn");
  shuffleBtn.addEventListener("click", shuffleCells);

  const restartBtn = document.querySelector(".restart-btn");
  restartBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    shuffleCells();
  });

  initCells();
}

window.addEventListener("DOMContentLoaded", main);
