avatars = (function avatars() {
	const avatars = [
		"https://giphy.com/embed/3o6UB117P7KdPnnpNC",
		"https://giphy.com/embed/xT77XUw1XMVGIxgove",
		"https://giphy.com/embed/xT77XMx5VvvTfMsTrq",
		"https://giphy.com/embed/xT77XUjQrAVQmf4jFS",
		"https://giphy.com/embed/3oKIPrM0c76shvCIMg",
		"https://giphy.com/embed/xT1XGPBvbwPBlphBSM",
		"https://giphy.com/embed/l2RnkvQ7tjhZsBNHq",
		"https://giphy.com/embed/OkiTaIOHMkG979XKso",
		"https://giphy.com/embed/l4sjjV4qfo2PzoetO",
	];

	const randomAvatar = () => {
		return avatars[Math.floor(Math.random() * avatars.length)];
	};

	function handleSwapAvatar() {
		this.closest(".big-panel").querySelector("iframe").classList.add("invis");
	}
	const initButtons = () => {
		document
			.querySelectorAll(".switch-avatar")
			.forEach((button) => button.addEventListener("click", handleSwapAvatar));
		document.querySelectorAll("iframe").forEach((x) => {
			x.addEventListener("transitionend", () => {
				if (x.classList.contains("invis")) {
					while (true) {
						const avatar = randomAvatar();
						if (x.getAttribute("src") !== avatar) {
							x.setAttribute("src", avatar);
							break;
						}
					}
				}
			});
			x.addEventListener("load", () => {
				x.classList.remove("invis");
			});
		});
	};
	return { initButtons };
})();

function gameBoard() {
	const boardLength = 9;
	let gameBoard = new Array(boardLength).fill("");
	let moveCount = 0;
	let scores = {
		X: 0,
		Tie: 0,
		O: 0,
	};

	const playerTurn = () => (moveCount % 2 ? "O" : "X");
	const gameState = () => {
		winner = (() => {
			for (let i = 0; i < boardLength; i += 3) {
				if (gameBoard[i] && gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2])
					return gameBoard[i];
			}
			for (let i = 0; i < 3; i++) {
				if (gameBoard[i] && gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6])
					return gameBoard[i];
			}

			if (
				(gameBoard[0] && gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8]) ||
				(gameBoard[4] && gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6])
			)
				return gameBoard[4];

			if (gameBoard.every((element) => element != "")) return "Tie";
			return null;
		})();

		if (winner) {
			scores[winner]++;
			console.log(scores);
			return { winner, score: scores[winner] };
		}
	};
	const resetGame = () => {
		gameBoard = new Array(boardLength).fill("");
		moveCount = 0;
	};

	const playerMove = (position) => {
		if (gameBoard[position] != "") return null;
		gameBoard[position] = playerTurn();
		moveCount++;
		console.log(gameBoard);
	};

	return { playerMove, resetGame, playerTurn, gameState };
}

const gamePlay = (function gamePlay() {
	const currentGameBoard = gameBoard();
	const timeDelay = 3000;
	let gamePositions;

	function refreshBoard() {
		gamePositions.forEach((gamePosition) => {
			const gamePiece = gamePosition.querySelector("p");
			gamePiece?.classList.remove("visible");
			setTimeout(() => (gamePosition.innerHTML = ""), 300);
		});
	}

	function handleClick(index, position) {
		if (position.hasChildNodes()) return;
		const slider = document.querySelector(".slider");
		const sliderText = slider.querySelector(".slider-text");
		const game = document.querySelector(".game");

		position.innerHTML = `<p>${currentGameBoard.playerTurn()}</p>`;
		const playerPiece = position.querySelector("p");
		position.offsetHeight;
		playerPiece.classList.add("visible");
		currentGameBoard.playerMove(index);

		let winner = currentGameBoard.gameState();
		if (winner) {
			let color = "green";
			if (winner.winner === "Tie") {
				color = "red";
			}
			sliderText.classList.add(color);
			game.classList.add("disabled");
			setTimeout(() => {
				sliderText.classList.remove(color);
				game.classList.remove("disabled");
				slider.classList.remove("slide");
				refreshBoard();
			}, timeDelay);
			currentGameBoard.resetGame();
			document.querySelector("." + winner.winner).innerHTML = winner.score;
		} else {
			slider.classList.toggle("slide");
		}
	}
	const initGame = () => {
		gamePositions = document.querySelectorAll(".game-position");
		gamePositions.forEach((gamePosition, index) => {
			gamePosition.addEventListener("click", () => handleClick(index, gamePosition));
		});
	};

	return { initGame };
})();
const main = (function mainLoop() {
	const startPage = document.querySelector(".start-page");
	const gamePage = document.querySelector(".game-page");
	avatars.initButtons();

	document.querySelector(".start-button").addEventListener("click", () => {
		gamePlay.initGame();
		startPage.classList.add("invis");
		setTimeout(() => {
			startPage.classList.add("hidden");
			gamePage.classList.remove("hidden");
			setTimeout(() => gamePage.classList.remove("invis"), 100);
		}, 800);
	});

	document.querySelector(".return").addEventListener("click", () => {
		gamePage.classList.add("invis");
		setTimeout(() => {
			gamePage.classList.add("hidden");
			startPage.classList.remove("hidden");
			setTimeout(() => startPage.classList.remove("invis"), 100);
		}, 800);
	});
})();
