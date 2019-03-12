import { adjustPosition, drag, allowDrop, drop, checkShipsPlacement, listenShipsGrid, displayShipPlacement} from "./placeShips.js"
import { listenSalvoes } from "./sendingSalvo.js"

loadData()
loadPlayer()
window.drag = drag;
window.allowDrop = allowDrop;
window.drop = drop;

export function getParams() {
    const ppp = window.location.search;
    const last = ppp.indexOf("p") + 1;
    const size = ppp.length;
    const result = ppp.slice(last, size);
    return result;
}

function loadData() {
const url = " http://localhost:8080/api/game_view/" + getParams();
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        const myGame = json;
        console.log(myGame);
        showSalvoesGrid(myGame);
        showPlayers(myGame);
        listenMyEvents();
        showShipsGrid(myGame);
        showHitsOnMe(myGame);
        listenShipsGrid(myGame);
        displayShipPlacement(myGame);
        listenSalvoes(myGame);
        displayGameState(myGame);
        showOppHits(myGame);
        showOppSinks(myGame);
        showSinksOnMe(myGame);
        hitsSinksTable(myGame);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}


function loadPlayer() {
    const url = " http://localhost:8080/api/games/";
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        const myPlayer = json.player;
        console.log(myPlayer);
        showLoggedUser(myPlayer);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}


function showPlayers(item) {
    for (let i = 0; i < item.gamePlayers.length; i++) {
        const n = getParams();
        if (item.gamePlayers[i].id === Number(n)) {document.getElementById("you").innerHTML = item.gamePlayers[i].player.email}
        if (item.gamePlayers[i].id !== Number(n)) {document.getElementById("opponent").innerHTML = item.gamePlayers[i].player.email}
    }
}


function showSalvoesGrid(item) {
    const n = getParams();
    const container = document.querySelector("#mySalvoes");
    for (let i = 0; i < 10; i++ ) {
        const row = container.insertRow();
        const firstCol = document.createElement("td");
        firstCol.innerHTML = String.fromCharCode(65 + i);
        row.appendChild(firstCol);
        for (let j = 0; j < 10; j++) {
            const column = document.createElement("td");
            column.setAttribute("id", String.fromCharCode(65 + i) + "" + (j + 1) + "salvo");
            column.setAttribute("data-id", String.fromCharCode(65 + i) + "" + (j + 1));
            for (let k = 0; k < item.salvoes.length; k++) {
                if (item.salvoes[k].gamePlayerId === Number(n)) {
                    for (let l = 0; l < item.salvoes[k].gamePlayerSalvoes.length; l++) {
                        for (let m = 0; m < item.salvoes[k].gamePlayerSalvoes[l].locations.length; m++) {
                            if (String.fromCharCode(65 + i) + "" + (j + 1) === item.salvoes[k].gamePlayerSalvoes[l].locations[m]) {
                                column.setAttribute("class", "salvo");
                            }
                        }
                    }
                }
           }
            row.appendChild(column);
        }
    }
}


function showShipsGrid(item) {
    const container = document.querySelector("#grid");
    for (let i = 0; i < 10; i++) {
        const row = container.insertRow();
        const firstCol = document.createElement("td");
        firstCol.innerHTML = String.fromCharCode(65 + i);
        row.appendChild(firstCol);
        for (let j = 0; j < 10; j++) {
            const column = document.createElement("td");
            column.setAttribute("id", String.fromCharCode(65 + i) + "" + (j + 1));
            for (let k = 0; k < item.ships.length; k++) {
                for (let l = 0; l < item.ships[k].locations.length; l++) {
                    if (String.fromCharCode(65 + i) + "" + (j + 1) === item.ships[k].locations[l]) {
                       column.setAttribute("class", "ship");
                    }
                }
            }
            row.appendChild(column);
        }
    }
}


function listenMyEvents() {
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
    document.getElementById("airCarrierBox").addEventListener("change", function () {adjustPosition("ship5", "airCarrier")});
    document.getElementById("battleshipBox").addEventListener("change", function () {adjustPosition("ship4", "battleship")});
    document.getElementById("submarineBox").addEventListener("change", function () {adjustPosition("ship3sub", "submarine")});
    document.getElementById("destroyerBox").addEventListener("change", function () {adjustPosition("ship3dest", "destroyer")});
    document.getElementById("patBoatBox").addEventListener("change", function () {adjustPosition("ship2", "patBoat")});
    document.getElementById("done").addEventListener("click", function () {checkShipsPlacement()});
}


function logoutPlayer() {
    fetch("/api/logout", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    })
    .then(function (data) {
    console.log('Request success: ', data);
    window.location.assign("http://localhost:8080/web/games.html");
    alert("You are logged out");
    localStorage.clear();
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function showLoggedUser(item) {
    document.querySelector("#loggedUser").innerHTML = item.name;
}


function showHitsOnMe(item) {
    for (let i = 0; i < item.ships.length; i++) {
        for (let j = 0; j < item.ships[i].hits.length; j++) {
            if (document.getElementById(item.ships[i].hits[j]).getAttribute("class") === "ship") {
                document.getElementById(item.ships[i].hits[j]).className += " myHit";
            }
        }
    }
}


function showSinksOnMe(item) {
    for (let i = 0; i < item.ships.length; i++) {
        if (item.ships[i].locations.length === item.ships[i].hits.length) {
            for (let j = 0; j < item.ships[i].locations.length; j++) {
                document.getElementById(item.ships[i].locations[j]).className = "ship mySink";
            }
        }
    }
}


function hitsSinksTable(item) {
    const container = document.getElementById("historyTable");
    const n = getParams();
    const ships1 = ["AircraftCarrier", "Battleship", "Submarine", "Destroyer", "PatrolBoat"];
    const ships2 = ["Aircraft Carrier", "Battleship", "Submarine", "Destroyer", "Patrol Boat"];
    for (let i = 0; i < item.history[0].gamePlayerHitsSinks.length + 2; i++) {
        let arrMeHits = [];
        let arrOppHits = [];
        let arrSinksMe = [];
        let arrSinksOpp = [];
        const row = container.insertRow();
        const turn = row.insertCell();
        turn.innerHTML = i + 1;
        const hitsOnMe = row.insertCell();
        hitsOnMe.setAttribute("class", "you");
        const myLeft = row.insertCell();
        myLeft.setAttribute("class", "you");
        const hitsOnOpp = row.insertCell();
        const oppLeft = row.insertCell();
        for (let j = 0; j < 2; j++) {
            if (item.history[j].gamePlayerId === Number(n)) {
                let sortMeTurns = item.history[j].gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
                for (let k = 0; k < ships1.length; k++) {
                    if (sortMeTurns[i].hits[ships1[k]].length !== 0) {arrMeHits.push(ships2[k] + ": " + sortMeTurns[i].hits[ships1[k]].length + ", ")};
                    if (sortMeTurns[i].sinks[ships1[k]] === "sunk" && sortMeTurns[i - 1].sinks[ships1[k]] !== "sunk") {arrSinksMe.push(" | " + ships2[k] + " sunk")};
                }
                hitsOnOpp.innerHTML = arrMeHits + arrSinksMe;
                oppLeft.innerHTML = sortMeTurns[i].sinks.left;
            }
            if (item.history[j].gamePlayerId !== Number(n)) {
                let sortOppTurns = item.history[j].gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
                for (let k = 0; k < ships1.length; k++) {
                    if (sortOppTurns[i].hits[ships1[k]].length !== 0) {arrOppHits.push(ships2[k] + ": " + sortOppTurns[i].hits[ships1[k]].length + ", ")};
                    if (sortOppTurns[i].sinks[ships1[k]] === "sunk" && sortOppTurns[i - 1].sinks[ships1[k]] !== "sunk") {arrSinksOpp.push(" | " + ships2[k] + " sunk")};
                }
                hitsOnMe.innerHTML = arrOppHits + arrSinksOpp,
                myLeft.innerHTML = sortOppTurns[i].sinks.left;
            }
        }
    }
}


function showOppHits(item) {
    const n = getParams();
    for (let i = 0; i < 2; i++) {
        if (item.history[i].gamePlayerId === Number(n)) {
            for (let j = 0; j <item.history[i].gamePlayerHitsSinks.length; j++) {
                for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].hits.hitsLocations.length; k++) {
                    if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].hits.hitsLocations[k] + "salvo").getAttribute("class") == "salvo") {
                        document.getElementById(item.history[i].gamePlayerHitsSinks[j].hits.hitsLocations[k] + "salvo").className += " oppHit";
                    }
                }
            }
        }
    }
}


function showOppSinks(item) {
    const n = getParams();
    for (let i = 0; i < 2; i++) {
        if (item.history[i].gamePlayerId === Number(n)) {
            const sortArr = item.history[i].gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
            const ships = ["AircraftCarrier", "Battleship", "Submarine", "Destroyer", "PatrolBoat"];
            for (let i = 0; i < sortArr.length; i++) {
                for (let j = 0; j < ships.length; j++) {
                    if (sortArr[i].sinks[ships[j]] === "sunk") {
                        for (let k = 0; k < sortArr[i].sinks[ships[j] + "Sunk"].length; k++) {
                            if (document.getElementById(sortArr[i].sinks[ships[j] + "Sunk"][k] + "salvo").classList.item(0) == "salvo") {
                                document.getElementById(sortArr[i].sinks[ships[j] + "Sunk"][k] + "salvo").className = "salvo oppSink";
                            }
                        }
                    }
                }
            }
        }
    }
}


function displayGameState(item) {
    document.getElementById("statusMessage").innerHTML = "";
    let timerId;
    function startReloading() {
        timerId = setTimeout(function() { location.reload(); startReloading(); }, 5000);
    }
    function stopReloading() {
         clearTimeout(timerId);
    }
    switch (item.gameState) {
        case "PlaceShips":
            document.getElementById("statusMessage").innerHTML = "Place your ships";
            break;
        case "WaitForOpponentToEnterGame":
            document.getElementById("statusMessage").innerHTML = "Waite for the opponent to enter the game";
            document.getElementById("salvoesSubmission").style.visibility = 'hidden';
            document.getElementById("gameHistory").style.visibility = 'hidden';
            document.getElementById("salvoDone").style.visibility = 'hidden';
            startReloading();
            break;
        case "WaitForOpponentToPlaceShips":
            document.getElementById("statusMessage").innerHTML = "Waite for the opponent to place ships";
            document.getElementById("salvoesSubmission").style.visibility = 'hidden';
            document.getElementById("gameHistory").style.visibility = 'hidden';
            document.getElementById("salvoDone").style.visibility = 'hidden';
            startReloading();
            break;
        case "WaitForOpponentSalvo":
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "none";
                }
            }
            document.getElementById("salvoDone").style.visibility = 'hidden';
            document.getElementById("statusMessage").innerHTML = "Waite for the opponent to fire salvo";
            //startReloading();
            break;
        case  "EnterSalvo":
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "auto";
                }
            }
            document.getElementById("statusMessage").innerHTML = "Enter your salvo";
            stopReloading();
            break;
        case  "GameOver":
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "none";
                }
            }
            document.getElementById("salvoDone").style.visibility = 'hidden';
            document.getElementById("statusMessage").innerHTML = "Game over"
            stopReloading();
            break;
    }
}
