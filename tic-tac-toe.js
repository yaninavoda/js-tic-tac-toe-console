const createPlayer = (name, marker) => {
    return { name, marker };
};

const Gameboard = (() => {
    let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

    const getBoard = () => [...board];
    const getPositionValue = (position) => board[position];
    const resetBoard = () => board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    const isFull = () => board.every(cell => cell !== ' ');
    const checkWin = (marker) => {
        const winningPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningPatterns.some(pattern => pattern.every(index => board[index] === marker));
    };
    const updateBoard = (position, marker) => {
        board[position] = marker;
    };

    return {
        resetBoard,
        getBoard,
        getPositionValue,
        updateBoard,
        isFull,
        checkWin
    }
})();

const DisplayController = (() => {
    const displayBoard = (board) => {
        console.log(`
        ${board[0]} | ${board[1]} | ${board[2]}
        ---------
        ${board[3]} | ${board[4]} | ${board[5]}
        ---------
        ${board[6]} | ${board[7]} | ${board[8]}
        `);
    };
    const displayMessage = (message) => console.log(message);

    return {
        displayBoard,
        displayMessage
    }
})();

const PlayerInputHandler = (() => {
    const getPlayerMove = (currentPlayer, callback) => {
        setTimeout(() => {
        const positionInput = prompt(`Player ${currentPlayer.name} (${currentPlayer.marker}), enter your move (1-9):`);
        const position = parseInt(positionInput) - 1;

        if (isNaN(position) || position < 0 || position > 8) {
          DisplayController.displayMessage('Invalid input. Please enter a number between 1 and 9.');
          getPlayerMove(currentPlayer, callback); // Ask again
        } else {
          callback(position);
        }
      }, 0);
    };

    return { getPlayerMove };
})();

const GameController = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver = false;

    const initializeGame = (player1, player2) => {
        players = [
            createPlayer(player1, 'X'),
            createPlayer(player2, 'O')
        ];
        currentPlayerIndex = 0;

        Gameboard.resetBoard();
        DisplayController.displayMessage('Welcome to Console Tic Tac Toe!');
        DisplayController.displayBoard(Gameboard.getBoard());
        promptForMove();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];
    const switchPlayer = () => {
        currentPlayerIndex = 1 - currentPlayerIndex;
    };

    const handleMove = (position) => {
        if (gameOver) return;
        const currentPlayer = getCurrentPlayer();
        if (Gameboard.getPositionValue(position) === ' ') {
            Gameboard.updateBoard(position, currentPlayer.marker);
            DisplayController.displayBoard(Gameboard.getBoard());
            if (Gameboard.checkWin(currentPlayer.marker)) {
                DisplayController.displayMessage(`Player ${currentPlayer.name} (${currentPlayer.marker}) wins!`);
                gameOver = true;
            } else if (Gameboard.isFull()) {
                DisplayController.displayMessage("It's a draw!");
                gameOver = true;
            } else {
                switchPlayer();
                promptForMove();
            }
        } else {
            DisplayController.displayMessage('That position is already taken. Try again.');
            promptForMove();
        }
    };

    const promptForMove = () => {
        if (gameOver) return;
        const currentPlayer = getCurrentPlayer();
        PlayerInputHandler.getPlayerMove(currentPlayer, handleMove);
    };
    return {
        initializeGame
    }
})();

GameController.initializeGame("Player 1", "Player 2");