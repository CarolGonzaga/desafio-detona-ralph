const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        menu: document.querySelector(".menu"),
        buttonVelocity: document.querySelectorAll(".btn-velo")
    },
    values: {
        hitPosition: 0,
        results: [],
        curretResult: 0,
        curretTime: 60,
        curretLive: 3,
    },
    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    }
}

function reloadPage() {
    location.reload();
}

function changeVelocity() {
    
    let currentVelocity = "normal";

    state.view.buttonVelocity.forEach((button) => {
        button.addEventListener("mousedown", () => {
            if (button.id !== currentVelocity) {

                if (button.id === "easy") {
                    setGameSpeed(1500);
                    currentVelocity = "easy";

                } else if (button.id === "normal") {
                    setGameSpeed(1000);
                    currentVelocity = "normal";

                } else {
                    setGameSpeed(500);
                    currentVelocity = "hard";
                }

                state.view.buttonVelocity.forEach(btn => btn.classList.remove("ativo"));
                button.classList.add("ativo");
            }
        });
    });
}

function setGameSpeed(speed) {
    clearInterval(state.actions.timerId);
    state.actions.timerId = setInterval(randomSquare, speed);
}


function endGame() {
    playSound("endgame");
    
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    state.view.menu.innerHTML = `
        <div class="game-over">
            <h2>Game Over!</h2>
            <p>Sua melhor pontuação foi: <span>${Math.max(...state.values.results)}</span></p>
        </div>
        <div class="game-over">
            <button class="btn-restart" onclick="reloadPage()">Restart</button>
        </div>
    `

    state.view.squares.forEach((square) => {
        square.classList.add("disable");
    });

    state.view.buttonVelocity.forEach((button) => {
        button.classList.add("disable");
    });
}

function countDown() {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;

    if (state.values.curretTime <= 0) {
        if (state.values.results == "") {
            state.values.results.push(state.values.curretResult);
        }
        endGame();
    }
}

function looseLive() {
    if (state.values.curretLive <= 1) {
        endGame();

    } else {
        state.values.curretLive--;
        state.view.lives.textContent = `x${state.values.curretLive}`;
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.1;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox(){
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition) {
                state.values.curretResult++;
                state.view.score.textContent = state.values.curretResult;
                state.values.hitPosition = null;
                playSound("hit");
            } else {
                playSound("miss");
                state.values.results.push(state.values.curretResult);
                state.values.curretResult = 0;
                state.view.score.textContent = state.values.curretResult;
                looseLive();
            }
        })
    })
}

function init() {
    addListenerHitBox();
    changeVelocity();
}

init();