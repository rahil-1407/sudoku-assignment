const sudoku = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];

let tile;
let lives;
let timeValue;
let selectedNum;
let selectedTile;
let disableSelect;

document.getElementById("start-btn").addEventListener("click", startGame);

function clearPrevious() {
  let tiles = document.querySelectorAll(".tile");
  //Remove each tile
  tiles.forEach((tile) => tile.remove());
  clearInterval(timeValue);
  selectedTile = null;
  selectedNum = null;
}

function startTimer() {
  const timer = document.getElementById("timer");
  let totalTime = 600;

  timeValue = setInterval(() => {
    totalTime = totalTime - 1;
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    timer.innerHTML = minutes + " minutes " + seconds + " seconds remaining!!";
    if (totalTime === 0) endGame();
  }, 1000);
}

function checkInputUser(input) {
  let pat = /[1-9]/g;
  if (input.length === 1 && input.match(pat)) return true;
  return false;
}

function placeDigitInTile(tile) {
  //If selecting is not disabled
  if (!disableSelect) {
    if (tile.classList.contains("selected")) {
      tile.classList.remove("selected");
      selectedTile = null;
    } else {
      for (let i = 0; i < 81; i++) {
        document.querySelectorAll(".tile")[i].classList.remove("selected");
      }
      tile.classList.add("selected");
      selectedTile = tile;

      selectedNum = prompt("Enter a Valid Digit");
      while (!checkInputUser(selectedNum)) {
        selectedNum = prompt("Enter a value between 0-9");
      }
      updateMove();
    }
  }
}

function generateBoard(board) {
  clearPrevious();

  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    tile = document.createElement("p");
    if (board.charAt(i) != "-") {
      tile.innerHTML = board.charAt(i);
    } else {
      //Add Click event listener to tile created
      tile.addEventListener("click", function () {
        placeDigitInTile(this);
      });
    }
    tile.id = idCount;
    idCount++;
    tile.classList.add("tile");
    document.getElementById("board").appendChild(tile);
  }
  startTimer();
}

function startGame() {
  let board = sudoku[0];
  disableSelect = false;
  lives = 10;
  document.getElementById("lives").innerHTML = "Lives Remaining: " + lives;
  generateBoard(board);
}

function checkCorrect(tile) {
  let solution = sudoku[1];
  if (solution.charAt(tile.id) === tile.innerHTML) return true;
  else return false;
}

function checkDone() {
  let tiles = document.querySelectorAll(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].innerHTML === "") return false;
  }
  return true;
}

function endGame() {
  disableSelect = true;
  clearInterval(timeValue);
  if (lives === 0 || timeRemaining === 0) {
    document.getElementById("lives").innerHTML = "You Lost!!";
  } else {
    document.getElementById("lives").innerHTML = "You Won!!";
  }
}

function updateWrongMove() {
  lives--;
  document.getElementById("lives").innerHTML = "Lives Remaining: " + lives;
  if (lives === 0) {
    endGame();
  } else {
    disableSelect = false;
  }
  //Restore tile color and remove selected from both
  selectedTile.classList.remove("incorrect");
  selectedTile.classList.remove("selected");
  selectedTile.innerHTML = "";
  selectedTile = null;
  selectedNum = null;
}

function updateMove() {
  //if a tile and a number is selected
  if (selectedTile && selectedNum) {
    selectedTile.innerHTML = selectedNum;
    if (checkCorrect(selectedTile)) {
      selectedTile.classList.remove("selected");
      selectedNum = null;
      selectedTile = null;
      //Check if board is completed
      if (checkDone()) {
        endGame();
      }
    } else {
      //Disable selecting numbers for one second
      disableSelect = true;
      selectedTile.classList.add("incorrect");
      setTimeout(updateWrongMove, 1000);
    }
  }
}
