loadData()
loadLeadBrd()
function loadData() {
    let url = " http://localhost:8080/api/games";

    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        //console.log(json);
        var myGames = json.games;
        console.log(myGames);
        showGames(myGames);

    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function loadLeadBrd() {
   let url2 ="http://localhost:8080/api/leader_board";
   fetch(url2).then((response) => {
       return response.json()
   })
   .then((json) => {
       //console.log(json);
       var myPlayers = json;
       console.log(myPlayers);
       showLeaders(myPlayers);
       listenLogs();
   })
   .catch((error) => {
       console.log("Request failed: " + error.message)
   })
}

function showGames(item) {
    let container = document.querySelector("#output");
    container.innerHTML = " ";
    for (let i = 0; i < item.length; i++) {
        let oneGame = document.createElement("li");
        oneGame.innerHTML = new Date(item[i].created).toUTCString() + ": "
        container.appendChild(oneGame);
        for (let j = 0; j < item[i].gamePlayers.length; j++) {
            let email = document.createElement("span");
            email.innerHTML = item[i].gamePlayers[j].player.email + ", ";
            oneGame.appendChild(email);
        }
    }
}

function showLeaders(item) {
    let container = document.querySelector("#leader-board");
    container.innerHTML = "";
    let firstRow = document.createElement("tr");
    container.appendChild(firstRow);
    let nameH = firstRow.insertCell();
    let totalH = firstRow.insertCell();
    let winsH = firstRow.insertCell();
    let lossesH = firstRow.insertCell();
    let tiesH = firstRow.insertCell();
    nameH.innerHTML = "Name";
    totalH.innerHTML = "Total";
    winsH.innerHTML = "Won";
    lossesH.innerHTML = "Lost";
    tiesH.innerHTML = "Tied";
    nameH.setAttribute("class", "to_left");
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

function listenLogs() {
    console.log("added");
    document.querySelector("#login").addEventListener("click", function () {findPlayer()});
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
}

function findPlayer() {
    console.log("result");
    let findUser = document.querySelector("#user");
    let findPassword = document.querySelector("#password");
    let user = findUser.value;
    let password = findPassword.value;
    console.log(user + " " + password);
    if (user && password) {loginPlayer(user, password)}
}


function loginPlayer(user, password) {
    fetch("/api/login", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: 'userName='+ user + '&password='+ password,
    })
    .then(function (data) {
    console.log('Request success: ', data);
    console.log("login");
    loginNow();
    location.reload();
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function logoutPlayer() {
    console.log("logout");

    fetch("/api/logout", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    })
    .then(function (data) {
    console.log('Request success: ', data);
    location.reload();
    logoutNow();
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function loginNow() {
    document.getElementById('loginForm').style.visibility = 'hidden';
    document.getElementById('logoutForm').style.visibility = 'visible';
    localStorage.setItem('showLogin', 'hidden');
    localStorage.setItem('showLogout', 'visible');
}

window.onload = function () {
        var showIn = localStorage.getItem('showLogin');
        var showOut = localStorage.getItem('showLogout');
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
}

function logoutNow () {
    document.getElementById('logoutForm').style.visibility = 'hidden'
    document.getElementById('loginForm').style.visibility = 'visible'
    localStorage.setItem('showLogin', 'visible');
    localStorage.setItem('showLogout', 'hidden');
}

function signInPlayer() {
    fetch("/api/players", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: 'userName='+ username + '&password='+ password,
    })
    .then(function (data) {
    console.log('Request success: ', data);
    }).then(function () {
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}
