export function createNewGame() {
    console.log("new game");

    fetch("/api/games", {
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

export function joinGame(id) {
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
    })
    .then(function (json) {
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