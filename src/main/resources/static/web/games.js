loadData()
loadLeadBrd()
function loadData() {
    let url = " http://localhost:8080/api/games";

    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        //console.log(json);
        var myGames = json;
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
    for (let i = 0; i < item.length; i++) {
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