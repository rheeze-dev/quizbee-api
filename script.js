const category = document.querySelector("#options-category");
const btnSubmit = document.querySelector(".btn-submit");
const btnStart = document.querySelector(".btn-start-game");
const timerDisplay = document.querySelector("#timer");
const inputFieldAnswer = document.querySelector("#input-answer");
const scoreText = document.querySelector(".text-score");
const highScoreText = document.querySelector(".text-high-score");
const livesLeft = document.querySelector(".text-attempts-left");
const questionsText = document.querySelector("#questions");
const btnReset = document.querySelector(".btn-reset");
const btnHint = document.querySelector(".btn-hint");
const btnAbout = document.querySelector(".btn-about");
const modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
let highScore = 0;
let questionNumber;
let timer;
let score;
let isSubmitBtnClicked;
let lives;

getDefaultValues();
btnStart.onclick = () => {
    inputFieldAnswer.value = "";
    questionNumber++;
    btnStart.disabled = true;
    btnSubmit.disabled = false;
    btnHint.disabled = false;
    btnReset.disabled = false;
    btnReset.style.display = "none";
    fetchQuestion(category.value);
    const timerInterval = setInterval(() => {
        timerDisplay.innerHTML = `<p class="timer-display">${timer} ${timer > 1 ? "seconds" : "second"}</p>`;
        timer--;
            if(timer == 0) {
                isSubmitBtnClicked = true;
                btnSubmit.click();
            }
    }, 1000)

    const submitBtnChecker = setInterval(() => {
        if(isSubmitBtnClicked) {
            clearInterval(timerInterval);
            clearInterval(submitBtnChecker);
            isSubmitBtnClicked = false;
        }
    }, 1);
}

btnReset.onclick = () => {
    getDefaultValues();
    questionsText.innerHTML = `<p style="color:blue;font-size:8rem;">Game has been reset!</p>`;
}

btnAbout.onclick = () => {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function fetchQuestion(category) {
    const response = await fetch(
        "https://api.api-ninjas.com/v1/trivia?category=" + category,
        {
            method: "GET",
            headers: {
                "X-Api-Key": "54/p8rt+p9QhgeN9G/Z5Sg==wrJ1tX7OT2EAdJcR",
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const answerGuide = showLetters(data[0]);
    let numberOfWords = countNumberOfWords(answerGuide);
    questionsText.innerHTML = 
    `<p class="display-questions">${data[0].question}</p>
    <p class="answer-length">Answer is ${numberOfWords} ${numberOfWords == 1 ? "word" : "words"} with ${data[0].answer.length} letters.</p>
    <p class="answer-length">${answerGuide.split('').join(',')}</p>`;
}

function showLetters(data) {
    let answer = data.answer;
    const max = data.answer.length;
    console.log(data.answer);
    for(let i = 0; i < max; i++) {
        const randomNumber = Math.floor(Math.random() * max);
        if(answer.charAt(randomNumber) == " ") continue;
        answer = setCharAt(answer, randomNumber, '_');
    }

    btnSubmit.onclick = () => {
        isSubmitBtnClicked = true;
        btnReset.style.display = '';
        if(inputFieldAnswer.value.toUpperCase() === data.answer.toUpperCase()) {
            score++;
            if(score > highScore) {
                highScore = score;
                highScoreText.innerHTML = highScore;
            }
            scoreText.innerHTML = score;
            timerDisplay.innerHTML = `<p class="timer-display" style="color:green;">Correct! ✔</p>`;
        }
        else {
            timerDisplay.innerHTML = `<p class="timer-display" style="color:red;">${data.answer}</p>`;
            lives--;
        }
        btnStart.disabled = false;
        btnSubmit.disabled = true;
        btnHint.disabled = true;
        btnStart.innerHTML = `Click here to start question #${questionNumber}`;
        livesLeft.innerHTML = parseFloat(lives).toFixed(1);
        if(lives <= 0) {
            btnStart.disabled = true;
            livesLeft.innerHTML = `<p style="color:red;font-size:5rem;">0</p>`;
            questionsText.innerHTML = `<p style="color:red;font-size:8rem;">Game Over!</p>`;
        }
        timer = 60;
    }

    let answerChar;
    btnHint.onclick = () => {
        lives = parseFloat((lives - .1).toFixed(1));
        if(lives <= 0) btnSubmit.click();
        else {
        livesLeft.innerHTML = parseFloat(lives).toFixed(1);
        for(let i = 0; i < max; i++) {
            const randomNumber = Math.floor(Math.random() * max);
            if(answer.charAt(randomNumber) != "_") continue;
            else {
                answerChar = data.answer[randomNumber];
            }
            answer = setCharAt(answer, randomNumber, answerChar);
        }
        let numberOfWords = countNumberOfWords(data.answer);
        questionsText.innerHTML = 
        `<p class="display-questions">${data.question}</p>
        <p class="answer-length">Answer is ${numberOfWords} ${numberOfWords == 1 ? "word" : "words"} with ${data.answer.length} letters.</p>
        <p class="answer-length">${answer.split('').join(',')}</p>`;
        }
    }
    
    return answer;
}

function setCharAt(str,index,char) {
    return str.substring(0,index) + char + str.substring(index+1);
}

function countNumberOfWords(words) {
    let numberOfWords = 1;
    for(let i = 0; i < words.length; i++) {
        if(words.charAt(i) == " ") numberOfWords++;
    }
    return numberOfWords;
}

window.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        btnSubmit.click();
    }
});

function getDefaultValues() {
    score = 0;
    questionNumber = 1;
    timer = 60;
    btnSubmit.disabled = true;
    btnStart.disabled = false;
    isSubmitBtnClicked = false;
    scoreText.innerHTML = score;
    highScoreText.innerHTML = highScore;
    btnStart.innerHTML = `Click here to start question #${questionNumber}`;
    timerDisplay.innerHTML = `<p class="timer-display">60 seconds</p>`;
    inputFieldAnswer.value = "";
    lives = 5;
    livesLeft.innerHTML = lives;
    btnHint.disabled = true;
    btnReset.disabled = true;
}