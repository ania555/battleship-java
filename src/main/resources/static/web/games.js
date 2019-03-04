import { findPlayer, formValidation, loginPlayer, checkLogin, loginNow, logoutPlayer, logoutNow, getSignPlayer, signInPlayer, checkSignIn, loginUser }  from "./login.js";
import { createNewGame, checkGameCreation, loadGameView, joinGame, checkGameJoin} from "./crateNewGame.js";

loadData()
loadLeaderBoard()


function loadData() {
    let url = " http://localhost:8080/api/games";

    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        console.log(json);
        var myGames = json.games;
        console.log(myGames);
        showGames(myGames);
        listenEvents(myGames);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function loadLeaderBoard() {
   let url2 ="http://localhost:8080/api/leader_board";
   fetch(url2).then((response) => {
       return response.json()
   })
   .then((json) => {
       //console.log(json);
       var myPlayers = json;
       console.log(myPlayers);
       showLeaderBoard(myPlayers);

   })
   .catch((error) => {
       console.log("Request failed: " + error.message)
   })
}

function showGames(item) {
    let container = document.querySelector("#output");
    container.innerHTML = " ";
    let user = localStorage.getItem('userName');
         console.log(user);
    for (let i = 0; i < item.length; i++) {
        let mySpan = document.createElement("span");
        mySpan.setAttribute("class", "form-inline");
        container.appendChild(mySpan);
        let oneLink = document.createElement("a");
        oneLink.setAttribute("href", findGameLink(item[i]));
        mySpan.appendChild(oneLink);
        let buttonSpan = document.createElement("span");
        mySpan.appendChild(buttonSpan);
        let oneButton = document.createElement("input");
        oneButton.setAttribute("id", "game" + item[i].id);
        oneButton.setAttribute("type", "button");
        oneButton.setAttribute("value", "join game");
        oneButton.setAttribute("data-id", item[i].id);
        oneButton.setAttribute("class", "btn btn-secondary mx-sm-3 mb-1");
        buttonSpan.appendChild(oneButton);
        let arrPlayers = item[i].gamePlayers.filter(function(x) {return (x.player.email === user)})
        //console.log(arrPlayers);
        if (arrPlayers.length > 0 || item[i].gamePlayers.length > 1) {buttonSpan.style.visibility = 'hidden'}
        let oneGame = document.createElement("li");
        oneGame.innerHTML = new Date(item[i].created).toUTCString().slice(4,22) + " | ";
        oneGame.setAttribute("class", "list-group-item list-group-item-action myList");
        oneLink.appendChild(oneGame);
        for (let j = 0; j < item[i].gamePlayers.length; j++) {
            let email = document.createElement("span");
            email.setAttribute("class", "mySpan");
            email.innerHTML = item[i].gamePlayers[j].player.email + ", ";
            oneGame.appendChild(email);
        }
    }
}

function findGameLink(item) {
    let showUserName = localStorage.getItem('userName');
//    console.log(showUserName);
    if (showUserName == null) { return "games.html"}
    else if (item.gamePlayers.length == 0) { return "games.html"}
    else if (item.gamePlayers.length == 1 && item.gamePlayers[0].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[0].id;}
    else if (item.gamePlayers.length == 1 && item.gamePlayers[0].player.email != showUserName) { return "games.html"}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[0].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[0].id;}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[1].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[1].id;}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[0].player.email != showUserName && item.gamePlayers[1].player.email != showUserName) {return "games.html"}
}

function showLeaderBoard(item) {
    let container = document.querySelector("#leadTBody");
    container.innerHTML = "";
    let sortedItems = item.sort(function(a, b) {
        if (b.totalScore !== a.totalScore) {
            return  b.totalScore - a.totalScore
        }
        else {
            return b.win_count - a.win_count
        }
    });
    for (let i = 0; i < sortedItems.length; i++) {
    console.log("row")
        let row = document.createElement("tr");
        container.appendChild(row);
        let name = row.insertCell();
        let total = row.insertCell();
        let wins = row.insertCell();
        let losses = row.insertCell();
        let ties = row.insertCell();
        name.innerHTML = item[i].email;
        total.innerHTML = item[i].totalScore;
        wins.innerHTML = item[i].win_count;
        losses.innerHTML = item[i].loss_count;
        ties.innerHTML = item[i].tie_count;
        name.setAttribute("class", "to_left");
    }
}

function listenEvents(item) {
    document.querySelector("#login").addEventListener("click", function () {findPlayer()});
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
    document.querySelector("#signin").addEventListener("click", function () {getSignPlayer()});
    document.querySelector("#createGame").addEventListener("click", function () {createNewGame()});
    for (let i = 0; i < item.length; i++) {
        let j = i + 1;
        document.getElementById("game" + j).addEventListener("click", function () {joinGame(this.getAttribute("data-id"))});
    }
}

window.onload = function () {
    let showIn = localStorage.getItem('showLogin');
    let showOut = localStorage.getItem('showLogout');
    let showLogUser = localStorage.getItem('loggedUser');
    let showUserName = localStorage.getItem('userName');
    if(showIn === 'visible'){
        document.getElementById('loginForm').style.visibility = 'visible';
    }
    else if (showIn === 'hidden'){
        document.getElementById('loginForm').style.visibility = 'hidden';
    }

    if (showOut === 'visible'){
        document.getElementById('logoutForm').style.visibility = 'visible';
    }
    else if (showOut === 'hidden') {
        document.getElementById('logoutForm').style.visibility = 'hidden';
    }

    if (showLogUser === 'visible'){
        document.getElementById('loggedUser').style.visibility = 'visible';
        document.getElementById('loggedUser').innerHTML = showUserName;
    }
    else if (showLogUser === 'hidden') {
        document.getElementById('loggedUser').style.visibility = 'hidden';
    }
}



