// Word list (you can expand this)
const words = ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE'];

// Select a random word
let targetWord = words[Math.floor(Math.random() * words.length)];
let attempts = 6;
let currentAttempt = '';

function initGame() {
    const gameBoard = document.getElementById('game-board');
    for (let i = 0; i < attempts; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
    createKeyboard();
    applyStyles();
}

function createKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.id = 'keyboard';
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
    ];
    keys.forEach(row => {
        const keyRow = document.createElement('div');
        keyRow.className = 'key-row';
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.textContent = key;
            keyButton.className = 'key';
            keyButton.onclick = () => handleKeyPress({ key });
            keyRow.appendChild(keyButton);
        });
        keyboard.appendChild(keyRow);
    });
    document.body.appendChild(keyboard);
}

function applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f0f0;
        }
        #game-board {
            margin-bottom: 20px;
        }
        .row {
            display: flex;
        }
        .cell {
            width: 60px;
            height: 60px;
            border: 2px solid #ccc;
            margin: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: white;
        }
        #keyboard {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .key-row {
            display: flex;
            margin-bottom: 8px;
        }
        .key {
            min-width: 40px;
            height: 50px;
            margin: 0 4px;
            border: none;
            border-radius: 4px;
            background-color: #d3d6da;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
        }
        .key:hover {
            background-color: #bbb;
        }
    `;
    document.head.appendChild(style);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        submitGuess();
    } else if (event.key === 'Backspace') {
        currentAttempt = currentAttempt.slice(0, -1);
    } else if (/^[A-Za-z]$/.test(event.key) && currentAttempt.length < 5) {
        currentAttempt += event.key.toUpperCase();
    }
    updateDisplay();
}

function submitGuess() {
    if (currentAttempt.length !== 5) return;

    const row = document.getElementsByClassName('row')[6 - attempts];
    for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        if (currentAttempt[i] === targetWord[i]) {
            cell.style.backgroundColor = '#6aaa64';
            cell.style.borderColor = '#6aaa64';
        } else if (targetWord.includes(currentAttempt[i])) {
            cell.style.backgroundColor = '#c9b458';
            cell.style.borderColor = '#c9b458';
        } else {
            cell.style.backgroundColor = '#787c7e';
            cell.style.borderColor = '#787c7e';
        }
        cell.style.color = 'white';
    }

    if (currentAttempt === targetWord) {
        alert('Congratulations! You guessed the word!');
    } else {
        attempts--;
        if (attempts === 0) {
            alert(`Game over! The word was ${targetWord}`);
        }
    }

    currentAttempt = '';
}

function updateDisplay() {
    const row = document.getElementsByClassName('row')[6 - attempts];
    for (let i = 0; i < 5; i++) {
        row.children[i].textContent = currentAttempt[i] || '';
    }
}

document.addEventListener('keydown', handleKeyPress);
window.onload = initGame;
