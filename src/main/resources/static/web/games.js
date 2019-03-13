import { findUser,  logoutPlayer}  from "./login.js";
import { createNewGame, joinGame} from "./crateNewGame.js";

loadData()
loadLeaderBoard()


function loadData() {
    const url = " http://localhost:8080/api/games";
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        const myGames = json.games;
        console.log(myGames);
        showGames(myGames);
        listenEvents(myGames);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function loadLeaderBoard() {
   const url2 ="http://localhost:8080/api/leader_board";
   fetch(url2).then((response) => {
       return response.json()
   })
   .then((json) => {
       const myPlayers = json;
       console.log(myPlayers);
       showLeaderBoard(myPlayers);

   })
   .catch((error) => {
       console.log("Request failed: " + error.message)
   })
}

function showGames(item) {
    const container = document.querySelector("#output");
    container.innerHTML = " ";
    const user = sessionStorage.getItem('userName');
    for (let i = 0; i < item.length; i++) {
        const mySpan = document.createElement("span");
        mySpan.setAttribute("class", "form-inline");
        container.appendChild(mySpan);
        const oneLink = document.createElement("a");
        oneLink.setAttribute("href", findGameLink(item[i]));
        mySpan.appendChild(oneLink);
        const buttonSpan = document.createElement("span");
        mySpan.appendChild(buttonSpan);
        const oneButton = document.createElement("input");
        oneButton.setAttribute("id", "game" + item[i].id);
        oneButton.setAttribute("type", "button");
        oneButton.setAttribute("value", "join game");
        oneButton.setAttribute("data-id", item[i].id);
        oneButton.setAttribute("class", "btn btn-secondary mx-sm-3 mb-1");
        buttonSpan.appendChild(oneButton);
        const arrPlayers = item[i].gamePlayers.filter(function(x) {return (x.player.email === user)})
        if (arrPlayers.length > 0 || item[i].gamePlayers.length > 1) {buttonSpan.style.visibility = 'hidden'}
        const oneGame = document.createElement("li");
        oneGame.innerHTML = new Date(item[i].created).toUTCString().slice(4,22) + " | ";
        oneGame.setAttribute("class", "list-group-item list-group-item-action myList");
        oneLink.appendChild(oneGame);
        for (let j = 0; j < item[i].gamePlayers.length; j++) {
            const email = document.createElement("span");
            email.setAttribute("class", "mySpan");
            email.innerHTML = item[i].gamePlayers[j].player.email + ", ";
            oneGame.appendChild(email);
        }
    }
}

function findGameLink(item) {
    const showUserName = sessionStorage.getItem('userName');
    if (showUserName == null) { return "games.html"}
    else if (item.gamePlayers.length == 0) { return "games.html"}
    else if (item.gamePlayers.length == 1 && item.gamePlayers[0].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[0].id;}
    else if (item.gamePlayers.length == 1 && item.gamePlayers[0].player.email != showUserName) { return "games.html"}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[0].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[0].id;}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[1].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[1].id;}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[0].player.email != showUserName && item.gamePlayers[1].player.email != showUserName) {return "games.html"}
}

function showLeaderBoard(item) {
    const container = document.querySelector("#leadTBody");
    container.innerHTML = "";
    const sortedItems = item.sort(function(a, b) {
        if (b.totalScore !== a.totalScore) {
            return  b.totalScore - a.totalScore
        }
        else {
            return b.win_count - a.win_count
        }
    });
    for (let i = 0; i < sortedItems.length; i++) {
        const row = container.insertRow();
        const name = row.insertCell();
        const total = row.insertCell();
        const wins = row.insertCell();
        const losses = row.insertCell();
        const ties = row.insertCell();
        name.innerHTML = item[i].email;
        total.innerHTML = item[i].totalScore;
        wins.innerHTML = item[i].win_count;
        losses.innerHTML = item[i].loss_count;
        ties.innerHTML = item[i].tie_count;
        name.setAttribute("class", "to_left");
    }
}

function listenEvents(item) {
    document.querySelector("#login").addEventListener("click", function () {findUser("login")});
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
    document.querySelector("#signin").addEventListener("click", function () {findUser("signIn")});
    document.querySelector("#createGame").addEventListener("click", function () {createNewGame()});
    for (let i = 0; i < item.length; i++) {
        let j = i + 1;
        document.getElementById("game" + j).addEventListener("click", function () {joinGame(this.getAttribute("data-id"))});
    }
}

window.onload = function () {
    const showIn = sessionStorage.getItem('showLogin');
    const showOut = sessionStorage.getItem('showLogout');
    const showLogUser = sessionStorage.getItem('loggedUser');
    const showUserName = sessionStorage.getItem('userName');
    document.getElementById('loginForm').style.visibility = showIn;
    document.getElementById('logoutForm').style.visibility = showOut;
    document.getElementById('loggedUser').style.visibility = showLogUser;
    document.getElementById('loggedUser').innerHTML = showUserName;
}



