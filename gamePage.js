const startButton = document.querySelector('#fantasy');
const fihishContainer = document.querySelector('#finish-container')
const questionContainerElement = document.getElementById('question-container')
const questionsUrl = "http://localhost:4000/questions/";
const questions2Url = "http://localhost:4000/questions_02/";
const questionsUrlFree = "http://localhost:4000/questions_free/";
const questionsUrlFree_02 = "http://localhost:4000/questions_free_02/";
const usersUrl = "http://localhost:4000/users/";
const imgContainer = document.querySelector(".movie-img");
const choiceA = document.querySelector(".btn-a");
const choiceB = document.querySelector(".btn-b");
const choiceC = document.querySelector(".btn-c");
const choiceD = document.querySelector(".btn-d");
const progress = document.querySelector("#progress");
const qImg = document.createElement("img");
const answerButtons = document.getElementById("answer-buttons");
const championList = document.querySelector('#score-container ol');
const mainMenu = document.querySelector("#main-page");
const buttons = document.querySelector('#buttons');
const progressContainer = document.querySelector('#progress-container');
const yourScore = document.querySelector('.your-score')
let counterTimer = document.getElementById("countdown")
const registerButton = document.querySelector('#register')
const startAgainButton = document.querySelector('#start-again')
const startingMinutes = 1;
let runningQuestionT = 0;
let score = 0;
let q = "";
let questionsT = [];
let time = startingMinutes * 60;



function timerStart() {
    resetTimer()
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

function resetTimer() {
    timer = 60 * 5;
  }
// isLogIn()


function isLogIn() {
    if (localStorage.token === undefined ) {
        window.location.href = "./"
    } 
    window.location.href = "./"
}

function logOut() {
    localStorage.clear();
    isLogIn()
}

mainMenu.addEventListener('click', function(){
    window.location.href = "index.html"
});
startButton.addEventListener('click', handleClick);
mainMenu.addEventListener('click', logOut);
registerButton.addEventListener('click', logOut);
startAgainButton.addEventListener('click', function() {
    window.location.href = "gamePage.html"
})


function handleClick(){
    buttons.style.display = 'none';
    fihishContainer.style.display = 'none';
    if (localStorage.token === undefined ) {
        console.log("There is no token ")
        getQuestions_free();
        startGame();
        timerStart()
    } else {
        console.log("There is token")
        getQuestions();
        startGame();
        timerStart()
        
    }
}

// getScoreInfo()

function getScoreInfo () {
    return fetch(usersUrl)
    .then(parseJSON)
    .then(users => displayUsersInfo(users["user"]))
}

function displayUsersInfo(users){
    let size = 10
    const buttonMore = document.createElement('button')
    buttonMore.textContent = "More champions"
    document.querySelector('#score-container').append(buttonMore)
    users.sort((a, b) => {
        return b.score - a.score
    })
    let cutUsers = users.slice(0, size)

    cutUsers.map(user => {
        if (user.id === localStorage.getItem("user_id")) {
            const usersScore = document.createElement('li')
            usersScore.textContent = user.username + ": " + user.score + "👑"
            usersScore.style.color = 'purple'
            usersScore.style.height = '100px'
            championList.appendChild(usersScore)
        }
        const usersScore = document.createElement('li')
        usersScore.textContent = user.username + ": " + user.score
        championList.appendChild(usersScore)
    })
    buttonMore.addEventListener('click', function() {
        document.querySelector('#score-container').removeChild(championList)
        const userOl = document.createElement('ol')
        document.querySelector('#score-container').append(userOl)
        users.map(user => {
            if (user.id == localStorage.getItem("user_id")) {
                const usersScore = document.createElement('li')
                usersScore.style.color = 'red'
                usersScore.textContent = user.username + ": " + user.score + "👑"
                console.log(usersScore)
                championList.appendChild(usersScore)
            }
            const usersScore = document.createElement('li')
            usersScore.textContent = user.username + ": " + user.score
            userOl.appendChild(usersScore)
        })
        buttonMore.style.display = 'none'
    })
}

function getQuestions_free() {
    console.log("There is free questions")
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
    startButton.style.display = 'none'
    questionContainerElement.style.display = 'block'
    document.querySelector("#progress").style.display = 'block'
    document.querySelector("#countdown").style.display = 'block'
    progress.textContent = "Your score is " + score
}

function renderQuestion(questions, runningQuestion){
    runningQuestionT = runningQuestion;
    questionsT = questions;
    q = questions[runningQuestion];
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
    questionContainerElement.style.display = 'none'
    document.querySelector("#progress").style.display = 'none'
    document.querySelector("#countdown").style.display = 'none'
    fihishContainer.style.display = 'block'
    if (localStorage.token != undefined ) {
        registerButton.style.display = 'none'
    }
    yourScore.textContent = "Congrats! Your score is:" + score
    getScoreInfo()
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


