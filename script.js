const category = document.querySelector("#options-category");
const btnSubmit = document.querySelector(".btn-submit");

document.querySelector("footer").innerHTML = "Copyright &copy; " + new Date().getFullYear();

btnSubmit.onclick = () => {
    console.log(category.value);
}

fetchQuestion(category.value);

async function fetchQuestion(category) {
    console.log(category);
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
    console.log(data[0]);
    let answerGuide = "";
    for(let i = 0; i < data[0].answer.length; i++) {
        answerGuide += "_ ";
    }
    console.log(answerGuide);
    document.querySelector("#questions").innerHTML = 
    `<p class="display-questions">${data[0].question}</p>
    <p class="answer-length">Answer length is: ${data[0].answer.length}</p>
    <p class="answer-length">${answerGuide}</p>`;
}
