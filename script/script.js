//creating the board
const render = (function () {
  //DOM cache
  const board = document.getElementById("gameBoard");
  //Rendering the squares inside the DOM
  for (let i = 0; i < 9; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.id = i;
    square.textContent = "";
    board.appendChild(square);
  }

  return { board };
})();
//GameBoard
const GameConditions = (function () {
  //Variables
  let innerBoard = ["", "", "", "", "", "", "", "", ""];
  let round = -1;
  //DOM Cache
  let square = document.getElementsByClassName("square");
  //Filling the squares
  for (let i = 0; i < innerBoard.length; i++) {
    square[i].textContent = innerBoard[i];
  }
  //Rounds
  function whoIsPlaying() {
    round++;
    if (round % 2 == 0) {
      return "player2";
    } else {
      return "player1";
    }
  }
  function restarte() {
    round = -1;
    for (let i = 0; i < innerBoard.length; i++) {
      square[i].textContent = "";
      innerBoard[i] = "";
    }
  }
  // Win conditions
  const win = function () {
    let winner = null;
    let wincondition = innerBoard.slice(0, 3).toString();
    let wincondition1 = innerBoard.slice(3, 6).toString();
    let wincondition2 = innerBoard.slice(6, 9).toString();
    if (
      wincondition == "x,x,x" ||
      wincondition1 == "x,x,x" ||
      wincondition2 == "x,x,x" ||
      (innerBoard[0] == "x" && innerBoard[3] == "x" && innerBoard[6] == "x") ||
      (innerBoard[1] == "x" && innerBoard[4] == "x" && innerBoard[7] == "x") ||
      (innerBoard[2] == "x" && innerBoard[5] == "x" && innerBoard[8] == "x") ||
      (innerBoard[0] == "x" && innerBoard[4] == "x" && innerBoard[8] == "x") ||
      (innerBoard[2] == "x" && innerBoard[4] == "x" && innerBoard[6] == "x")
    ) {
      return (winner = "x");
    } else if (
      wincondition === "o,o,o" ||
      wincondition1 === "o,o,o" ||
      wincondition2 === "o,o,o" ||
      (innerBoard[0] == "o" && innerBoard[3] == "o" && innerBoard[6] == "o") ||
      (innerBoard[1] == "o" && innerBoard[4] == "o" && innerBoard[7] == "o") ||
      (innerBoard[2] == "o" && innerBoard[5] == "o" && innerBoard[8] == "o") ||
      (innerBoard[0] == "o" && innerBoard[4] == "o" && innerBoard[8] == "o") ||
      (innerBoard[2] == "o" && innerBoard[4] == "o" && innerBoard[6] == "o")
    ) {
      return (winner = "o");
    } else if (round == 8 && winner == null) {
      return "tie";
    } else {
      return winner;
    }
  };
  return { square, win, innerBoard, whoIsPlaying, restarte };
})();

//Players Object
const players = function (name) {
  return { name };
};

//Game Logic
const gameLogic = (function () {
  const { board } = render;
  const { square, win, innerBoard, whoIsPlaying } = GameConditions;
  //DOM cache
  const getPlayer = document.getElementById("singlePlayer");
  const multiPlayer1 = document.getElementById("multiPlayer1");
  const multiPlayer2 = document.getElementById("multiPlayer2");
  //Variables
  let number = "";
  let selection;
  let singlePlayer;
  let multi1;
  let multi2;
  // Ai random move
  const randomMove = function () {
    number = Math.floor(Math.random() * (9 - 0)) + 0;
  };
  function dumbMode() {
    if (square[number].textContent == "") {
      square[number].textContent = "x";
      innerBoard[number] = "x";
    } else {
      randomMove();
      dumbMode();
    }
  }
  //Ai minimax move
  function godMode() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (innerBoard[i] == "") {
        innerBoard[i] = "x";
        let score = minimax(innerBoard, 0, false);
        innerBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = [i];
        }
      }
    }
    innerBoard[move] = "x";
    square[move].textContent = "x";
  }
  //minimax
  let scores = {
    x: 10,
    o: -10,
    tie: 0,
  };
  function minimax(position, depth, maximizingPlayer) {
    let result = win();
    if (result !== null) {
      return scores[result];
    }
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (position[i] == "") {
          position[i] = "x";
          let val = minimax(position, depth - 1, false);
          position[i] = "";
          maxEval = Math.max(val, maxEval);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (position[i] == "") {
          position[i] = "o";
          let val = minimax(position, depth - 1, true);
          position[i] = "";
          minEval = Math.min(val, minEval);
        }
      }
      return minEval;
    }
  }
  //selecting game mode
  document.querySelectorAll(".ativeBtn").forEach((item) => {
    item.addEventListener("click", (event) => {
      var mode = event.target.id;
      selection = mode;
    });
  });
  // Player move
  board.addEventListener("click", play, false);
  function play(e) {
    let move = e.target.id;
    if (square[move].textContent == "" && whoIsPlaying() == "player1") {
      square[move].textContent = "o";
      innerBoard[move] = "o";
      if (selection !== "multiplayer") {
        autoPlay();
      }
    } else if (square[move].textContent == "") {
      if (selection == "multiplayer") {
        square[move].textContent = "x";
        innerBoard[move] = "x";
      }
    } else {
      console.log("space taken");
    }
    checkWinner();
  }
  // Ai automove
  function autoPlay() {
    if (whoIsPlaying() == "player2") {
      if (selection == "easyMode") {
        randomMove();
        dumbMode();
      } else if (selection == "godMode") {
        godMode();
      }
    }
  }
  // Get the name of the players
  function getPlayers() {
    singlePlayer = getPlayer.value;
    multi1 = multiPlayer1.value;
    multi2 = multiPlayer2.value;
  }
  // See if someone is winning
  function endGameWarning(text) {
    const { restarte } = GameConditions;
    const didConfirm = confirm(text);
    if (didConfirm) {
      restarte();
    }
  }

  function checkWinner() {
    const { randomMove, dumbMode, getPlayers } = gameLogic;
    function goAgain() {
      getPlayers();
      randomMove();
      dumbMode();
      whoIsPlaying();
    }
    if (selection == "multiplayer") {
      if (win() == "x") {
        let dois = players(multi1);
        endGameWarning(`voce ganhou ${dois.name}`);
      } else if (win() == "o") {
        let tre = players(multi2);
        endGameWarning(`voce ganhou ${tre.name}`);
      } else if (win() == "tie") {
        endGameWarning("empatou");
      }
    } else {
      let um = players(singlePlayer);
      if (win() == "x") {
        endGameWarning(`voce perdeu ${um.name}`);
        goAgain();
      } else if (win() == "o") {
        endGameWarning(`voce ganhou ${um.name}`);
        goAgain();
      } else if (win() == "tie") {
        endGameWarning("empatou");
        goAgain();
      }
    }
  }

  return { autoPlay, randomMove, dumbMode, getPlayers };
})();
// Menu animations
const animations = (function () {
  const { randomMove, dumbMode, getPlayers } = gameLogic;
  const { whoIsPlaying, restarte } = GameConditions;
  //DOM Cache
  const one = document.getElementById("1");
  const single = document.getElementById("single");
  const single1 = document.getElementById("single1");
  const single2 = document.getElementById("single2");
  const multiplayer = document.getElementById("multiplayer");
  const getNames = document.getElementById("getNames");
  const game = document.getElementById("game");
  const playMulti = document.getElementById("playMulti");
  const play = document.getElementById("play");
  const restart = document.getElementById("restart");
  const changeMode = document.getElementById("changeMode");
  const wrapperButtons = document.getElementById("gameButtons");
  const gameBoardWrapper = document.getElementById("gameBoardWrapper");
  //Single Player animatiom
  single.addEventListener("click", singlePlayer, false);
  function singlePlayer() {
    one.style.display = "none";
    single1.style.display = "flex";
  }
  single1.addEventListener("click", singlePlayer1, false);
  function singlePlayer1() {
    single1.style.display = "none";
    single2.style.display = "flex";
  }
  play.addEventListener("click", singlePlayer2, false);
  function singlePlayer2() {
    single2.style.display = "none";
    wrapperButtons.style.display = "none";
    game.style.display = "flex";
    gameBoardWrapper.style.display = "flex";
    getPlayers();
    randomMove();
    dumbMode();
    whoIsPlaying();
  }
  //Multiplayer animatiom
  multiplayer.addEventListener("click", multi, false);
  function multi() {
    one.style.display = "none";
    getNames.style.display = "flex";
  }
  playMulti.addEventListener("click", multiplayer2, false);
  function multiplayer2() {
    getPlayers();
    getNames.style.display = "none";
    game.style.display = "flex";
    wrapperButtons.style.display = "none";
    gameBoardWrapper.style.display = "flex";
  }
  restart.addEventListener("click", redo, false);
  function redo() {
    restarte();
    singlePlayer2();
  }
  changeMode.addEventListener("click", newMode, false);
  function newMode() {
    restarte();
    wrapperButtons.style.display = "flex";
    gameBoardWrapper.style.display = "none";
    game.style.display = "none";
    one.style.display = "flex";
  }
})();
