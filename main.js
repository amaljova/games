// Navigation
const btnHome = document.getElementById('btn-home');
const btnSnake = document.getElementById('btn-snake');
const btnTictactoe = document.getElementById('btn-tictactoe');
const btnMemory = document.getElementById('btn-memory');
const btnWhackamole = document.getElementById('btn-whackamole');

const welcomeScreen = document.getElementById('welcome-screen');
const snakeScreen = document.getElementById('snake-screen');
const tictactoeScreen = document.getElementById('tictactoe-screen');
const memoryScreen = document.getElementById('memory-screen');
const whackamoleScreen = document.getElementById('whackamole-screen');

function showScreen(screen) {
    // Hide all screens
    welcomeScreen.classList.add('hidden');
    snakeScreen.classList.add('hidden');
    tictactoeScreen.classList.add('hidden');
    memoryScreen.classList.add('hidden');
    whackamoleScreen.classList.add('hidden');
    
    // Show selected screen
    screen.classList.remove('hidden');
}

btnHome.addEventListener('click', () => showScreen(welcomeScreen));
btnSnake.addEventListener('click', () => {
    showScreen(snakeScreen);
    if (!snakeGameStarted) {
        startSnakeGame();
        snakeGameStarted = true;
    }
});
btnTictactoe.addEventListener('click', () => {
    showScreen(tictactoeScreen);
    if (!tictactoeInitialized) {
        initTictactoe();
        tictactoeInitialized = true;
    }
});
btnMemory.addEventListener('click', () => {
    showScreen(memoryScreen);
    if (!memoryInitialized) {
        initMemoryMatch();
        memoryInitialized = true;
    }
});
btnWhackamole.addEventListener('click', () => {
    showScreen(whackamoleScreen);
    if (!whackamoleInitialized) {
        initWhackaMole();
        whackamoleInitialized = true;
    }
});

// Snake Game Logic
let snakeGameStarted = false;
function startSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('snake-score');

    // Game constants
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    // Game variables
    let speed = 7;
    let score = 0;

    let snake = [
        { x: 10, y: 10 }
    ];
    
    let velocityX = 0;
    let velocityY = 0;
    
    let foodX = 5;
    let foodY = 5;
    
    let gameOver = false;

    // Main game loop
    function gameLoop() {
        if (gameOver) {
            drawGameOver();
            return;
        }
        
        // Update snake position
        changeSnakePosition();
        
        // Check if game over
        let result = isGameOver();
        if (result) {
            gameOver = true;
        }

        // Clear the canvas
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface-color');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        drawSnake();
        
        // Draw food
        drawFood();
        
        // Check if food eaten
        checkFoodCollision();
        
        // Call game loop again
        setTimeout(gameLoop, 1000 / speed);
    }

    // Start listening for keyboard input
    document.addEventListener('keydown', keyDown);

    function keyDown(event) {
        // Up
        if (event.keyCode === 38 && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
        // Down
        else if (event.keyCode === 40 && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        }
        // Left
        else if (event.keyCode === 37 && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
        // Right
        else if (event.keyCode === 39 && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
        
        // If game is over, restart on any key
        if (gameOver) {
            resetGame();
        }
    }

    function changeSnakePosition() {
        // Move each part of the snake except the head
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = {...snake[i - 1]};
        }
        
        // Move the head
        snake[0].x += velocityX;
        snake[0].y += velocityY;
    }

    function drawSnake() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        
        // Draw each part of the snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
        }
    }

    function drawFood() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--danger-color');
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
    }

    function checkFoodCollision() {
        if (snake[0].x === foodX && snake[0].y === foodY) {
            // Add a new part to the snake
            snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y});
            
            // Generate new food position
            generateFood();
            
            // Increase score
            score++;
            scoreElement.textContent = score;
            
            // Increase speed slightly
            if (speed < 15) {
                speed += 0.2;
            }
        }
    }

    function generateFood() {
        let newFoodPosition = false;
        
        while (!newFoodPosition) {
            foodX = Math.floor(Math.random() * tileCount);
            foodY = Math.floor(Math.random() * tileCount);
            
            // Check if new food position overlaps with snake
            newFoodPosition = true;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === foodX && snake[i].y === foodY) {
                    newFoodPosition = false;
                    break;
                }
            }
        }
    }

    function isGameOver() {
        // Check if snake hit the wall
        if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
            return true;
        }
        
        // Check if snake hit itself
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }

    function drawGameOver() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press any key to restart', canvas.width / 2, canvas.height / 2 + 30);
    }

    function resetGame() {
        // Reset snake
        snake = [{ x: 10, y: 10 }];
        velocityX = 0;
        velocityY = 0;
        
        // Reset food
        foodX = 5;
        foodY = 5;
        
        // Reset score
        score = 0;
        scoreElement.textContent = score;
        
        // Reset speed
        speed = 7;
        
        // Reset game state
        gameOver = false;
        
        // Start game loop again
        gameLoop();
    }

    // Start game
    generateFood();
    gameLoop();
}

// Tic-tac-toe Game Logic
let tictactoeInitialized = false;
function initTictactoe() {
    const board = document.getElementById('tictactoe-board');
    const statusDisplay = document.getElementById('tictactoe-status');
    const resetButton = document.getElementById('tictactoe-reset');
    
    // Create cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('tictactoe-cell');
        cell.setAttribute('data-index', i);
        board.appendChild(cell);
    }
    
    // Game variables
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Status messages
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;
    
    // Update display
    statusDisplay.textContent = currentPlayerTurn();
    
    // Handle cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Check if cell is already filled or game is inactive
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        
        // Check for win or draw
        checkResult();
    }
    
    function checkResult() {
        let roundWon = false;
        
        // Check for winning condition
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
            
            if (condition) {
                roundWon = true;
                break;
            }
        }
        
        // Handle win
        if (roundWon) {
            statusDisplay.textContent = winningMessage();
            gameActive = false;
            return;
        }
        
        // Handle draw
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = drawMessage();
            gameActive = false;
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = currentPlayerTurn();
    }
    
    // Reset game
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = currentPlayerTurn();
        
        // Clear cells
        document.querySelectorAll('.tictactoe-cell').forEach(cell => {
            cell.textContent = '';
        });
    }
    
    // Event listeners
    document.querySelectorAll('.tictactoe-cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', resetGame);
}

// Memory Match Game Logic
let memoryInitialized = false;
function initMemoryMatch() {
    const board = document.getElementById('memory-board');
    const movesDisplay = document.getElementById('memory-moves');
    const timeDisplay = document.getElementById('memory-time');
    const difficultySelect = document.getElementById('memory-difficulty-select');
    const resetButton = document.getElementById('memory-reset');
    const wonDisplay = document.getElementById('memory-won');
    
    // Game variables
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let gameActive = false;
    let timer = 0;
    let timerInterval;
    let gridSize = 4; // Default 4x4 grid
    
    // Emoji symbols for cards (16 pairs for 4x4 and 6x6 grids)
    const symbols = [
        '🍎', '🍌', '🍒', '🍓', '🍑', '🍍', '🥝', '🥥',
        '🦊', '🐶', '🐱', '🦁', '🐼', '🐨', '🐯', '🦄',
        '🚗', '🚕', '🚙', '🚌', '🏎️', '🚓', '🚑', '🚒',
        '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓',
        '🎯', '🎮', '🎨', '🎭', '🎪', '🎢', '🎠', '🎬', 
        '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '📷', '📹',
        '💎', '👑', '👒', '👓', '🧤', '👜', '👝', '🎒',
        '⭐', '🌟', '✨', '💫', '☄️', '🔥', '🌈', '🌊'
    ];
    
    // Start game
    function startGame() {
        resetGame();
        createBoard();
        gameActive = true;
        startTimer();
    }
    
    // Create game board
    function createBoard() {
        // Clear the board
        board.innerHTML = '';
        
        // Set grid template based on difficulty
        board.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
        board.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
        
        // Get number of pairs needed
        const numPairs = (gridSize * gridSize) / 2;
        
        // Create array of pairs
        const cardSymbols = [];
        for (let i = 0; i < numPairs; i++) {
            cardSymbols.push(symbols[i]);
            cardSymbols.push(symbols[i]);
        }
        
        // Shuffle array
        shuffle(cardSymbols);
        
        // Create cards
        for (let i = 0; i < cardSymbols.length; i++) {
            createCard(i, cardSymbols[i]);
        }
    }
    
    // Create a card
    function createCard(index, symbol) {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-index', index);
        card.setAttribute('data-symbol', symbol);
        
        const cardInner = document.createElement('div');
        cardInner.classList.add('memory-card-inner');
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('memory-card-front');
        cardFront.textContent = symbol;
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('memory-card-back');
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener('click', () => flipCard(card));
        
        board.appendChild(card);
        cards.push(card);
    }
    
    // Flip a card
    function flipCard(card) {
        // Ignore if game not active, card already flipped, or two cards already flipped
        if (!gameActive || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // If two cards flipped, check for match
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            
            checkForMatch();
        }
    }
    
    // Check for match
    function checkForMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
        
        if (card1.getAttribute('data-symbol') === card2.getAttribute('data-symbol')) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            
            // Check if all matches found
            if (matches === cards.length / 2) {
                gameWon();
            }
        } else {
            // No match, flip cards back after delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }
        
        // Clear flipped cards after delay
        setTimeout(() => {
            flippedCards = [];
        }, 1000);
    }
    
    // Game won
    function gameWon() {
        gameActive = false;
        clearInterval(timerInterval);
        
        wonDisplay.textContent = `Congratulations! You won in ${moves} moves and ${timer} seconds!`;
    }
    
    // Start timer
    function startTimer() {
        clearInterval(timerInterval);
        timer = 0;
        timeDisplay.textContent = timer;
        
        timerInterval = setInterval(() => {
            timer++;
            timeDisplay.textContent = timer;
        }, 1000);
    }
    
    // Reset game
    function resetGame() {
        cards = [];
        flippedCards = [];
        moves = 0;
        matches = 0;
        gameActive = false;
        
        movesDisplay.textContent = moves;
        wonDisplay.textContent = '';
        
        clearInterval(timerInterval);
        timer = 0;
        timeDisplay.textContent = timer;
    }
    
    // Shuffle array (Fisher-Yates algorithm)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Event listeners
    resetButton.addEventListener('click', startGame);
    
    difficultySelect.addEventListener('change', () => {
        gridSize = parseInt(difficultySelect.value);
        startGame();
    });
    
    // Start initial game
    startGame();
}

// Whack-a-Mole Game Logic
let whackamoleInitialized = false;
function initWhackaMole() {
    const board = document.getElementById('whackamole-board');
    const scoreDisplay = document.getElementById('whackamole-score');
    const timeDisplay = document.getElementById('whackamole-time');
    const difficultySelect = document.getElementById('whackamole-difficulty-select');
    const startButton = document.getElementById('whackamole-start');
    const messageDisplay = document.getElementById('whackamole-message');
    
    // Game variables
    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let timerInterval;
    let difficulty = 'easy';
    let holes = [];
    let molePopInterval;
    let currentMole = null;
    
    // Create game board
    function createBoard() {
        // Clear the board
        board.innerHTML = '';
        
        // Create 9 holes in a 3x3 grid
        for (let i = 0; i < 9; i++) {
            createHole(i);
        }
    }
    
    // Create a hole with mole
    function createHole(index) {
        const hole = document.createElement('div');
        hole.classList.add('whackamole-hole');
        hole.setAttribute('data-index', index);
        
        const mole = document.createElement('div');
        mole.classList.add('whackamole-mole');
        mole.textContent = '🦔'; // Hedgehog emoji for the mole
        
        hole.appendChild(mole);
        board.appendChild(hole);
        
        // Add click event to whack the mole
        hole.addEventListener('click', () => whackMole(index));
        
        // Store reference to mole
        holes.push({
            hole: hole,
            mole: mole,
            active: false
        });
    }
    
    // Start game
    function startGame() {
        if (gameActive) return;
        
        // Reset game state
        resetGame();
        
        // Start timer
        gameActive = true;
        startButton.textContent = 'Game in Progress...';
        startButton.disabled = true;
        difficultySelect.disabled = true;
        
        // Start popping moles
        startMolePopup();
        
        // Start countdown timer
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    // Start mole popup logic
    function startMolePopup() {
        // Set difficulty parameters
        let minDelay, maxDelay, stayUpTime;
        
        switch (difficulty) {
            case 'easy':
                minDelay = 1200;
                maxDelay = 2000;
                stayUpTime = 1500;
                break;
            case 'medium':
                minDelay = 800;
                maxDelay = 1500;
                stayUpTime = 1200;
                break;
            case 'hard':
                minDelay = 500;
                maxDelay = 1200;
                stayUpTime = 1000;
                break;
        }
        
        function popUpRandomMole() {
            // Make sure game is still active
            if (!gameActive) return;
            
            // Hide previous mole if any
            if (currentMole !== null) {
                hideCurrentMole();
            }
            
            // Select random hole
            const randomIndex = Math.floor(Math.random() * holes.length);
            
            // Make mole active and pop up
            holes[randomIndex].active = true;
            holes[randomIndex].mole.classList.add('active');
            currentMole = randomIndex;
            
            // Hide mole after stay up time
            setTimeout(() => {
                if (gameActive && holes[randomIndex].active) {
                    hideCurrentMole();
                }
            }, stayUpTime);
            
            // Schedule next mole
            const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
            molePopInterval = setTimeout(popUpRandomMole, nextDelay);
        }
        
        // Start the first mole popup
        popUpRandomMole();
    }
    
    // Hide current active mole
    function hideCurrentMole() {
        if (currentMole !== null) {
            holes[currentMole].mole.classList.remove('active');
            holes[currentMole].mole.classList.remove('hit');
            holes[currentMole].active = false;
            currentMole = null;
        }
    }
    
    // Whack a mole
    function whackMole(index) {
        // Ignore if game not active or mole not active
        if (!gameActive || !holes[index].active) {
            return;
        }
        
        // Register hit
        score++;
        scoreDisplay.textContent = score;
        
        // Show visual feedback
        holes[index].mole.classList.add('hit');
        
        // Make mole inactive
        holes[index].active = false;
        
        // Hide mole after brief delay to show hit state
        setTimeout(() => {
            if (holes[index].mole.classList.contains('active')) {
                holes[index].mole.classList.remove('active');
                holes[index].mole.classList.remove('hit');
            }
        }, 300);
    }
    
    // End game
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        clearTimeout(molePopInterval);
        
        // Hide any active moles
        hideCurrentMole();
        
        // Update UI
        startButton.disabled = false;
        startButton.textContent = 'Start Game';
        difficultySelect.disabled = false;
        
        // Show game over message
        messageDisplay.textContent = `Game Over! Your score: ${score}`;
    }
    
    // Reset game
    function resetGame() {
        score = 0;
        timeLeft = 30;
        gameActive = false;
        
        // Update UI
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        messageDisplay.textContent = '';
        
        // Clear any active moles
        hideCurrentMole();
        
        // Clear timers
        clearInterval(timerInterval);
        clearTimeout(molePopInterval);
    }
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    
    difficultySelect.addEventListener('change', () => {
        difficulty = difficultySelect.value;
    });
    
    // Create the initial board
    createBoard();
}
