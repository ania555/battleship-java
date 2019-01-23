loadData()
loadLeadBrd()
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
        listenLogs(myGames);
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
        container.appendChild(mySpan);
        let oneLink = document.createElement("a");
        oneLink.setAttribute("href", findLink(item[i]));
        mySpan.appendChild(oneLink);
        let buttonSpan = document.createElement("span");
        container.appendChild(buttonSpan);
        let oneButton = document.createElement("input");
        oneButton.setAttribute("id", "game" + item[i].id);
        oneButton.setAttribute("type", "button");
        oneButton.setAttribute("value", "join game");
        oneButton.setAttribute("data-id", item[i].id);
        buttonSpan.appendChild(oneButton);
        let arrPlayers = item[i].gamePlayers.filter(function(x) {return (x.player.email === user)})
        //console.log(arrPlayers);
        if (arrPlayers.length > 0 || item[i].gamePlayers.length > 1) {buttonSpan.style.visibility = 'hidden'}
        let oneGame = document.createElement("li");
        oneGame.innerHTML = new Date(item[i].created).toUTCString() + ": "
        oneLink.appendChild(oneGame);
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

function listenLogs(item) {
    console.log("added");
    document.querySelector("#login").addEventListener("click", function () {findPlayer()});
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
    document.querySelector("#signin").addEventListener("click", function () {getSignPlayer()});
    document.querySelector("#createGame").addEventListener("click", function () {createNewGame()});
    for (let i = 0; i < item.length; i++) {
        let j = i + 1;
        document.getElementById("game" + j).addEventListener("click", function () {joinGame(this.getAttribute("data-id"))});
    }
}

function findPlayer() {
    console.log("result");
    let findUser = document.querySelector("#user");
    let findPassword = document.querySelector("#password");
    let user = findUser.value;
    let password = findPassword.value;
    console.log(user + " " + password);
    if (!user || !password) {
        alert('Please enter email and password!');
        document.querySelector("#user").style.borderColor = "red";
        document.querySelector("#password").style.borderColor = "red";
        return false;
    }
    if (user && password) {formValidation(user, password)}
}

function formValidation(user, password) {
    //var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w {2, 3})+$/;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    //var regpass = /^(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,16}$/;
    console.log("validation");
    if (reg.test(user) == false) {
        document.querySelector("#user").style.borderColor = "red";
        alert('Invalid email address');
        return false;
    }
    if (password.length < 2) {
        document.querySelector("#password").style.borderColor = "red";
        alert('Invalid password');
        return false;
    }
    if (reg.test(user) == true && password.length >= 2) { alert("ok"); loginPlayer(user, password)}
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
    checkLogin(data, user);
    //loginNow();
    //location.reload();
    //alert("You are logged in");
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function checkLogin(item, user) {
    if (item.status == 200) {
        console.log(user);
        loginNow(user);
        location.reload();
        alert("You are logged in");
    }
    else {alert("Invalid email or password"); return false;}
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
    alert("You are logged out");
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}



function loginNow(user) {
    document.getElementById('loginForm').style.visibility = 'hidden';
    document.getElementById('logoutForm').style.visibility = 'visible';
    document.getElementById('loggedUser').style.visibility = 'visible';
    document.getElementById('loggedUser').innerHTML = user;
    localStorage.setItem('showLogin', 'hidden');
    localStorage.setItem('showLogout', 'visible');
    localStorage.setItem('loggedUser', 'visible');
    localStorage.setItem('userName', user);
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

function logoutNow () {
    document.getElementById('logoutForm').style.visibility = 'hidden'
    document.getElementById('loginForm').style.visibility = 'visible'
    document.getElementById('loggedUser').style.visibility = 'hidden';
    localStorage.setItem('showLogin', 'visible');
    localStorage.setItem('showLogout', 'hidden');
    localStorage.setItem('loggedUser', 'hidden');
    localStorage.setItem('userName', null);
}

function getSignPlayer() {
    console.log("result_signin");
    let findUser = document.querySelector("#user");
    let findPassword = document.querySelector("#password");
    let user = findUser.value;
    let password = findPassword.value;
    console.log(user + " " + password);
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!user || !password) {
        alert('Please enter email and password!');
        document.querySelector("#user").style.borderColor = "red";
        document.querySelector("#password").style.borderColor = "red";
        return false;
    }
    console.log("validation");
    if (reg.test(user) == false) {
        document.querySelector("#user").style.borderColor = "red";
        alert('Invalid email address');
        return false;
    }
    if (password.length < 2) {
        document.querySelector("#password").style.borderColor = "red";
        alert('Invalid password');
        return false;
    }
    //if (reg.test(user) == true && password.length >= 2) { alert("ok"); loginPlayer(user, password)}
    if (user && password && reg.test(user) == true && password.length >= 2) {alert("ok"); signInPlayer(user, password)}
}

function signInPlayer(user, password) {
    fetch("/api/players", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: 'userName='+ user + '&password='+ password,
    })
    .then(function (data) {
    console.log('Request success: ', data);
    checkSignIn(data);
    //loginNow();
    //location.reload();
    //alert("You have signed in");
    }).then(function () {
    loginUser(user, password);
    //loginPlayer(user, password);
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function checkSignIn(item) {
    let myStatus = item.status.toString();
    localStorage.setItem('status', myStatus);
    if (item.status == 201) {
        alert("You are signed in");
    }
    //else if (item.status == 409) {alert("Username already exists"); return false;}
    //else if (item.status != 201 && item.status != 409) { return false;}
}

function loginUser(user, password) {
    let signStatus = localStorage.getItem('status');
    if (signStatus == 409) {alert("Username already exists"); return false;}
    else if (signStatus != 201 && signStatus != 409) { return false;}
    else if (signStatus == 201) {loginPlayer(user, password)}
}

function findLink(item) {
    let showUserName = localStorage.getItem('userName');
    console.log(showUserName);
    if (showUserName == null) { return "games.html"}
    else if (item.gamePlayers.length == 0) { return "games.html"}
    else if (item.gamePlayers.length == 1 && item.gamePlayers[0].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[0].id;}
    else if (item.gamePlayers.length == 1 && item.gamePlayers[0].player.email != showUserName) { return "games.html"}

    else if (item.gamePlayers.length == 2 && item.gamePlayers[0].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[0].id;}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[1].player.email == showUserName) {return "game.html?gp" + item.gamePlayers[1].id;}
    else if (item.gamePlayers.length == 2 && item.gamePlayers[0].player.email != showUserName && item.gamePlayers[1].player.email != showUserName) {return "games.html"}
}

function createNewGame() {
    console.log("new game");
    let user = localStorage.getItem('userName');
    console.log(user);
    fetch("/api/games", {
        credentials: 'include',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: 'userName='+ user,
        })
        .then(function (data) {
        console.log('Request success: ', data);
        let datStatus= data.status;
        checkGameCreation(datStatus);
        return data.json()
        }).then(function (json) {
        console.log(json)
        let myId = json.gpId.toString();
        console.log(myId);
        loadGameView(myId);
        })
        .catch(function (error) {
        console.log('Request failure: ', error);
        });
}

function checkGameCreation(status) {
     console.log(status);
     if (status == 201) {alert("You have created a new game")}
     else if (status == 401) {alert("You have to log in")}
}

function loadGameView(item) {
    if (item != null) {window.location.assign("http://localhost:8080/web/game.html?gp" + item)}
}

function joinGame(id) {
    console.log("join game");

    console.log(id);
    const url = "/api/game/" + id + "/players";

    fetch(url, {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: "application/json"
    },
    method: 'POST',
    })
    .then(function (data) {
    console.log('Request success: ', data);
    let datStatus= data.status;
    checkGameJoin(datStatus);
    return data.json()
    }).then(function (json) {
    console.log(json)
    let myId = json.gpId.toString();
    console.log(myId);
    loadGameView(myId);
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function checkGameJoin(status) {
     console.log(status);
     if (status == 201) {alert("You have joined the game")}
     else if (status == 401) {alert("You have to log in")}
}