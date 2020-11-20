const startButton = document.querySelector('.fantasy');
const questionContainerElement = document.getElementById('question-container')
const questionsUrl = "http://localhost:3000/questions/";
const questions2Url = "http://localhost:3000/questions_02/";
const questionsUrlFree = "http://localhost:3000/questions_free/";
const questionsUrlFree_02 = "http://localhost:3000/questions_free_02/";
const usersUrl = "http://localhost:3000/users/";
const imgContainer = document.querySelector(".movie-img");
const choiceA = document.querySelector(".btn-a");
const choiceB = document.querySelector(".btn-b");
const choiceC = document.querySelector(".btn-c");
const choiceD = document.querySelector(".btn-d");
const progress = document.querySelector("#progress");
const qImg = document.createElement("img");
const answerButtons = document.getElementById("answer-buttons");
const championList = document.querySelector('.score-container ol');
const logOutButton = document.querySelector(".log-out");
const mainMenu = document.querySelector(".main-page");
const startingMinutes = 1;
let counterTimer = document.getElementById("countdown")
let runningQuestionT = 0;
let score = 0;
let q = "";
let questionsT = [];
let time = startingMinutes * 60;

function timerStart() {
    setInterval(timer, 1000)
    
    function timer() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds > 9) {
            counterTimer.innerHTML = `${minutes}:${seconds}`
        } else {
            counterTimer.innerHTML = `${minutes}:0${seconds}`
        }
        time--
        if (time === 0) {
            answerIsWrong()
        }
    }
}

// isLogIn()


function isLogIn() {
    if (localStorage.token === undefined ) {
        window.location.href = "./"
    } 
}

function logOut() {
    localStorage.clear();
    isLogIn()
}

mainMenu.addEventListener('click', function(){
    window.location.href = "index.html"
});
startButton.addEventListener('click', handleClick);
logOutButton.addEventListener('click', logOut)


function handleClick(){
    if (localStorage.token === undefined ) {
        getQuestions_free();
        startGame();
        timerStart()
    } else {
        getQuestions();
        startGame();
        timerStart()
        
    }
}

getScoreInfo()

function getScoreInfo () {
    return fetch(usersUrl)
    .then(parseJSON)
    .then(users => displayUsersInfo(users["user"]))
}

function displayUsersInfo(users){
    users.sort((a, b) => {
        return b.score - a.score
    })
    users.map(user => {
        const usersScore = document.createElement('li')
        usersScore.textContent = user.username + ": " + user.score
        
        championList.appendChild(usersScore)
    })
    championList.style.display = 'none'

}

function getQuestions_free() {
    return fetch(questionsUrlFree)
        .then(parseJSON)
        .then(questions => displayQuestion(questions["question"]))
}

function getQuestions_free_02() {
    return fetch(questionsUrlFree_02)
        .then(parseJSON)
        .then(questions => displayQuestion(questions["question"]))
}


function getQuestions2() {
    return fetch(questions2Url, {
        headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(parseJSON)
        .then(questions => displayQuestion(questions["questions"]))
}

function getQuestions() {
    return fetch(questionsUrl, {
        headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(parseJSON)
        .then(questions => displayQuestion(questions["questions"]))
}

function parseJSON(response) {
    return response.json();
}

function displayQuestion(questions) {
    questionsT =questions
    
    for (var i = questions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i); 
        var temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }
    
    const lastQuestion = questions.length - 1;
    renderQuestion(questions, runningQuestionT);
}

function startGame() {
    startButton.classList.add('hide');
    questionContainerElement.classList.remove('hide');
    progress.textContent = "Your score is " + score
}

function renderQuestion(questions, runningQuestion){
    runningQuestionT = runningQuestion;
    questionsT = questions;
    q = questions[runningQuestion];
    console.log(q)
    qImg.removeAttribute('src');
    choiceA.textContent = "";
    choiceB.textContent = "";
    choiceC.textContent = "";
    choiceD.textContent = "";

    qImg.src = q.shot_src;
    choiceA.textContent = q.choiceA;
    choiceB.textContent = q.choiceB;
    choiceC.textContent = q.choiceC;
    choiceD.textContent = q.choiceD;
    
    imgContainer.append(qImg)
}
    answerButtons.addEventListener("click", (event) => {
        checkAnswer(event, q, questionsT, runningQuestionT)
    })

function checkAnswer(event, q, questions, runningQuestion){
    if (event.target.textContent === q.correct) {
        renderProgress()
        runningQuestion++;
        renderQuestion(questions, runningQuestion);
    } else {
        answerIsWrong()
    }
}

function answerIsWrong() {
    startButton.classList.remove('hide');
    questionContainerElement.classList.add('hide');
    location.reload();
}

function renderProgress(){
    score++
    progress.textContent = "Your score is " + score

    const id = localStorage.user_id
    const newScore = {
        score: score
    }
    if (score > 40){
        if (localStorage.token === undefined ){
            getQuestions_free_02()
        } else {
            getQuestions2()
        }
    }
    if (score > localStorage.score) {
        localStorage.setItem("score", score)
        fetch(usersUrl + id, {
            method: "PATCH",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(newScore)
        })
        .then(response => response.json())
       
    }
}





