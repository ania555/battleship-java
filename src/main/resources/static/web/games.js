loadData()
function loadData() {
let url = " http://localhost:8080/api/games";
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        console.log(json);
        var myGames = json;
        console.log(myGames);
        showGames(myGames);
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