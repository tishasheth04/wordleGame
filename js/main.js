document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    let guessedWords = [[]];
    let availableSpace = 1;

    let word = ""; // This will hold the randomly selected word
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    // Fetch words from the embedded script tag
    function fetchWordsFromHTML() {
        const wordListElement = document.getElementById("word-list");
        const wordList = wordListElement.textContent.split("\n").filter(w => w.trim().length === 5);
        return wordList.map(w => w.trim());
    }

    // Initialize the game
    function initializeGame() {
        const wordList = fetchWordsFromHTML();
        word = wordList[Math.floor(Math.random() * wordList.length)];
        console.log(`The word is: ${word}`); // Debugging: Logs the selected word to the console
    }

    initializeGame();

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function getCurrentWordArr() {
        return guessedWords[guessedWords.length - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace += 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
            return;
        }

        const currentWord = currentWordArr.join("");
        const letterCounts = {};

        // Count occurrences of each letter in the target word
        for (const letter of word) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        currentWordArr.forEach((letter, index) => {
            const letterId = guessedWordCount * 5 + 1 + index;
            const letterEl = document.getElementById(letterId);

            // Default tile color
            let tileColor = "rgb(58,58,60)"; // Grey for incorrect letters

            if (word[index] === letter) {
                tileColor = "rgb(83,141,78)"; // Green for correct position
                letterCounts[letter]--;
            }

            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
        });

        // Second pass: Handle yellow tiles for letters in the wrong position
        currentWordArr.forEach((letter, index) => {
            const letterId = guessedWordCount * 5 + 1 + index;
            const letterEl = document.getElementById(letterId);

            if (word[index] !== letter && letterCounts[letter] > 0) {
                letterEl.style.backgroundColor = "rgb(181, 159, 59)"; // Yellow
                letterEl.style.borderColor = "rgb(181, 159, 59)";
                letterCounts[letter]--;
            }
        });

        guessedWordCount += 1;

        if (currentWord === word) {
            window.alert("Congrats!");
        } else if (guessedWords.length === 6) {
            window.alert(`Sorry no more guesses! The word is: ${word}.`);
        }

        guessedWords.push([]);
    }

    keys.forEach(key => {
        key.onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord();
            } else if (letter === "del") {
                const currentWordArr = getCurrentWordArr();
                if (currentWordArr.length > 0) {
                    currentWordArr.pop();

                    const lastSpaceEl = document.getElementById(String(availableSpace - 1));
                    lastSpaceEl.textContent = "";

                    availableSpace -= 1;
                }
            } else {
                updateGuessedWords(letter);
            }
        };
    });
});
