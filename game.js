// game.js
const cardsData = [
  { id: 1, symbol: '🍎' },
  { id: 2, symbol: '🍌' },
  { id: 3, symbol: '🍓' },
  { id: 4, symbol: '🍊' },
  { id: 5, symbol: '🍋' },
  { id: 6, symbol: '🍇' },
  { id: 7, symbol: '🍐' },
  { id: 8, symbol: '🍒' }
];

const cards = [...cardsData, ...cardsData].map((card, index) => ({
  ...card,
  id: index + 1,
  matched: false
}));


  
let player1Name = '';
let player2Name = '';
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let player1Wins = 0;
let player2Wins = 0;
let openCards = [];
let gameBoard;

// Shuffle cards
function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

// Create game board
function createGameBoard() {
  gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';

  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;
    cardElement.addEventListener('click', handleCardClick);

    const frontFace = document.createElement('div');
    frontFace.classList.add('front-face');

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');

    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.symbol, 60, 60);

    frontFace.appendChild(canvas);
    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);
    gameBoard.appendChild(cardElement);
  });
}


// Handle card click
function handleCardClick(event) {
  const cardElement = event.currentTarget;
  const cardId = parseInt(cardElement.dataset.id);
  const card = cards.find(c => c.id === cardId);

  if (openCards.length < 2 && !card.matched && !cardElement.classList.contains('open')) {
    openCards.push(card);
    cardElement.classList.add('open');

    if (openCards.length === 2) {
      if (openCards[0].symbol === openCards[1].symbol) {
        openCards[0].matched = true;
        openCards[1].matched = true;
        openCards.forEach(c => {
          const matchedCard = document.querySelector(`[data-id="${c.id}"]`);
          matchedCard.classList.add('matched');
        });
        updateScore();
        openCards = [];
      } else {
        setTimeout(() => {
          openCards.forEach(c => {
            const openCard = document.querySelector(`[data-id="${c.id}"]`);
            openCard.classList.remove('open');
          });
          openCards = [];
          swapPlayer();
        }, 1000);
      }
    }
  }

  if (cards.every(c => c.matched)) {
    setTimeout(() => {
      updatePlayerWins();
      resetGame();
    }, 500);
  }
}

// Update score
function updateScore() {
  if (currentPlayer === 1) {
    player1Score++;
    document.getElementById('player1Score').textContent = `${player1Name} Score: ${player1Score}`;
  } else {
    player2Score++;
    document.getElementById('player2Score').textContent = `${player2Name} Score: ${player2Score}`;
  }
}


// Swap player
function swapPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateCurrentPlayer();
}

// Update current player display
function updateCurrentPlayer() {
  const player1Element = document.getElementById('player1');
  const player2Element = document.getElementById('player2');

  if (currentPlayer === 1) {
    player1Element.classList.add('current-player');
    player2Element.classList.remove('current-player');
  } else {
    player1Element.classList.remove('current-player');
    player2Element.classList.add('current-player');
  }
}

// Reset game
function resetGame() {
  player1Score = 0;
  player2Score = 0;
  openCards = [];
  cards.forEach(card => card.matched = false);
  document.getElementById('player1Score').textContent = `${player1Name} Score: 0`;
  document.getElementById('player2Score').textContent = `${player2Name} Score: 0`;
  shuffleCards();
  createGameBoard();
  updateCurrentPlayer();
}


// Initialize game
function initializeGame() {
  if (cards.length % 2 !== 0) {
    alert('Number of cards must be even.');
    return;
  }

  document.getElementById('player1').addEventListener('input', updatePlayerName);
  document.getElementById('player2').addEventListener('input', updatePlayerName);
  document.getElementById('newGameButton').addEventListener('click', startNewGame);
  resetGame();
}

// Update player name
function updatePlayerName(event) {
  const inputElement = event.target;
  const playerId = inputElement.id;

  if (playerId === 'player1') {
    player1Name = inputElement.value || 'Player 1';
    document.getElementById('player1Score').textContent = `${player1Name} Score: ${player1Score}`;
    document.getElementById('player1Wins').textContent = `${player1Name} Wins: ${player1Wins}`;
  } else if (playerId === 'player2') {
    player2Name = inputElement.value || 'Player 2';
    document.getElementById('player2Score').textContent = `${player2Name} Score: ${player2Score}`;
    document.getElementById('player2Wins').textContent = `${player2Name} Wins: ${player2Wins}`;
  }
}


// Update player wins
function updatePlayerWins() {
  if (player1Score > player2Score) {
    player1Wins++;
    document.getElementById('player1Wins').textContent = `${player1Name} Wins: ${player1Wins}`;
  } else {
    player2Wins++;
    document.getElementById('player2Wins').textContent = `${player2Name} Wins: ${player2Wins}`;
  }
}



// Start new game
function startNewGame() {
  resetWins();
  resetGame();
}

// Reset wins
function resetWins() {
  player1Wins = 0;
  player2Wins = 0;
  document.getElementById('player1Wins').textContent = `${player1Name} Wins: 0`;
  document.getElementById('player2Wins').textContent = `${player2Name} Wins: 0`;
}


// Start the game
initializeGame();