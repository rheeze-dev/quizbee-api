const category = document.querySelector("#options-category");
const btnSubmit = document.querySelector(".btn-submit");
const btnStart = document.querySelector(".btn-start-game");
const timerDisplay = document.querySelector(".timer-display");
const inputFieldAnswer = document.querySelector("#input-answer");
const scoreText = document.querySelector(".text-score");
const highScoreText = document.querySelector(".text-high-score");
let highScore = 0;
let questionNumber;
let timer;
let score;
let isSubmitBtnClicked;

document.querySelector("footer").innerHTML = "Copyright &copy; " + new Date().getFullYear();

setDefaultValues();

btnStart.onclick = () => {
    inputFieldAnswer.value = "";
    questionNumber++;
    btnStart.disabled = true;
    btnSubmit.disabled = false;
    fetchQuestion(category.value);
    const timerInterval = setInterval(() => {
        timer--;
        timerDisplay.innerHTML = `${timer} ${timer > 1 ? "seconds" : "second"}`;
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

document.querySelector(".btn-reset").onclick = () => {
    setDefaultValues();
    isSubmitBtnClicked = true;
    document.querySelector("#questions").innerHTML = "<p>Reset has been successful!</p>";
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
    let numberOfWords = 1;
    for(let i = 0; i < answerGuide.length; i++) {
        if(answerGuide.charAt(i) == " ") numberOfWords++;
    }
    document.querySelector("#questions").innerHTML = 
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
        if(inputFieldAnswer.value.toUpperCase() === data.answer.toUpperCase()) {
            score++;
            if(score > highScore) {
                highScore = score;
                highScoreText.innerHTML = highScore;
            }
            scoreText.innerHTML = score;
            timerDisplay.innerHTML = `Correct!`;
        }
        else {
            timerDisplay.innerHTML = `${data.answer}`;
        }
        btnStart.disabled = false;
        btnSubmit.disabled = true;
        btnStart.innerHTML = `Click here to start question #${questionNumber}`;
        timer = 10;
    }
    return answer;
}

window.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        btnSubmit.click();
    }
});

function setCharAt(str,index,char) {
    return str.substring(0,index) + char + str.substring(index+1);
}

function setDefaultValues() {
    score = 0;
    questionNumber = 1;
    timer = 10;
    btnSubmit.disabled = true;
    btnStart.disabled = false;
    isSubmitBtnClicked = false;
    scoreText.innerHTML = score;
    highScoreText.innerHTML = highScore;
    btnStart.innerHTML = `Click here to start question #${questionNumber}`;
    timerDisplay.innerHTML = `60 seconds`;
    inputFieldAnswer.value = "";
}