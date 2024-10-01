// Login Page
const loginPage = document.getElementById("section_login");
const boardPage = document.getElementById("game-board");
const resultsPage = document.getElementById("results-table");

document.getElementById("login_button").addEventListener("click", login);

const login = async () => {
    const username = document.getElementById("login_input_username").value;
    const password = document.getElementById("login_input_password").value;

    try{
        const response = await fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        });

        if(!response.data){
            const data = await response.json();
            alert(`Login failed: ${data.message}`)
        }
        alert("Login successful!");
        loginPage.style.display = "none";
        boardPage.style.display = "block";
    }
    catch(error){
        console.error(error);
    }
};

// tic tac toe game
const socket = io("http://localhost:3500", {
    withCredentials: false,
    transports:['websocket']
});

socket.on("connect", () => {
    console.log("conneceted to the server");
});

socket.on("connect_error", () => {
    console.log("Connection error", error);
});

socket.on('disconnect', () => {
    console.log("User disconnected"); 
});

const board = document.getElementById("board");
const squares = document.getElementsByClassName("square");
const restartButton = document.getElementById("restartButton")
const players = ["X", "O"];
let currentPlayer = players[0];
const endMessage = document.createElement("h3");
endMessage.textContent = `${currentPlayer}'s turn!`;
endMessage.style.marginTop = "30px";
endMessage.style.textAlign = "center";
board.after(endMessage);

const sendMove = (move) => {
    socket.emit('start game', move);
};

socket.on("start game", function(data) {
    const square = squares[data.position];
    square.textContent = data.player;

    if(data.status === 'ongoing'){
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        endMessage.textContent = `${currentPlayer}'s turn!`;
    }
    else if(data.status === 'finished'){
        endMessage.textContent = data.resu;t === 'draw'? "It's a draw" : `${data.result} wins!`;
    }
});

Array.from(squares).forEach((square, index) => {
    square.addEventListener("click", function() {
        if (square.textContent !== '') return;

        const move = {
            player: currentPlayer,
            position: index
        };
        sendMove(move);
    });
});

const startNewGame = () => {
    socket.emit("start game");
};

const resetBoard = () => {
    Array.from(squares).forEach(square => {
        square.textContent = "";
    });
};

restartButton.addEventListener("click", startNewGame);

// results table page
const resultButton = document.getElementById("resultButton");
const resultTable = document.getElementById("table");

const getResultsFromServer = async (id) => {
    try{
        const response = await fetch(`http://localhost:3500/:${id}`, {
            method: "GET"
        });
        const results = await response.json();
        console.log(results);
        await addResultsToTable(results);
    }
    catch(error){
        console.error(error);
    }
};

const addResultsToTable = (results) => {
    results.forEach(result => {
        createRow(result);
    })
};

const createRow = (result) => {
    const newRow = document.createElement("tr");

    const playerName = document.createElement("td");
    playerName.innerText = result.playerName;

    const wins = document.createElement("td");
    wins.innerText = result.numWins;

    const losses = document.createElement("td");
    losses.innerText = result.numLosses;

    const ties = document.createElement("td");
    ties.innerText = result.numTies;

    newRow.appendChild(playerName);
    newRow.appendChild(wins);
    newRow.appendChild(losses);
    newRow.appendChild(ties);

    resultTable.appendChild(newRow);
}

resultButton.addEventListener("click", () => {
    boardPage.style.display = "none";
    resultTable.style.display = "block";
    getResultsFromServer;
});