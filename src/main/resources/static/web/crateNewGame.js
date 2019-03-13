export function createJoinGame(id, item) {
    let url;
    if (item === "join") {url = "/api/game/" + id + "/players"}
    else if (item === "create") {url = "/api/games"}

    fetch(url, {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: "application/json"
    },
    method: 'POST',
    })
    .then((data) => {
        console.log('Request success: ', data);
        const datStatus= data.status;
        if (item === "join") {checkGameJoin(datStatus)}
        else if (item === "create") {checkGameCreation(datStatus)}
        return data.json()
    })
    .then((json) => {
        console.log(json)
        const myId = json.gpId.toString();
        console.log(myId);
        loadGameView(myId);
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    });
}

function checkGameJoin(status) {
     if (status == 201) {alert("You have joined the game")}
     else if (status == 401) {alert("You have to log in")}
}

function checkGameCreation(status) {
     if (status == 201) {alert("You have created a new game")}
     else if (status == 401) {alert("You have to log in")}
}

function loadGameView(item) {
    if (item != null) {window.location.assign("http://localhost:8080/web/game.html?gp" + item)}
}