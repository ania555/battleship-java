import { adjustPosition, drag, allowDrop, drop, checkShipsPlacement, listenShipsGrid, displayShipPlacement} from "./placeShips.js"
import { listenSalvoes } from "./sendingSalvo.js"

loadData()
loadPlayer()
/*let ooo = window.location.search;
console.log(ooo);*/
window.drag = drag;
window.allowDrop = allowDrop;
window.drop = drop;

export function getParams() {
  //var obj = {};
  //var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

let ppp = window.location.search;
let last = ppp.indexOf("p") + 1;
let size = ppp.length;
let result = ppp.slice(last, size);

 /*window.location.search.replace(reg, function(match, param, val) {
      obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
    });*/

  return result;
}

function loadData() {
let url = " http://localhost:8080/api/game_view/" + getParams();
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        let myGame = json;
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
    let url = " http://localhost:8080/api/games/";
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        console.log(json);
        let myPlayer = json.player;
        console.log(myPlayer);
        showLoggedUser(myPlayer);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function showPlayers(item) {
    for (let i = 0; i < item.gamePlayers.length; i++) {
        let n = getParams();
        if (item.gamePlayers[i].id == n) {document.getElementById("you").innerHTML = item.gamePlayers[i].player.email}
        if (item.gamePlayers[i].id != n) {document.getElementById("opponent").innerHTML = item.gamePlayers[i].player.email}
    }
}

function showSalvoesGrid(item) {
    let container = document.querySelector("#mySalvoes");
    for (let i = 0; i < 10; i++ ) {
        let row = document.createElement("tr");
        container.appendChild(row);
        let firstCol = document.createElement("td");
        firstCol.innerHTML = String.fromCharCode(65 + i);
        row.appendChild(firstCol);
        for (let j = 0; j < 10; j++) {
            let column = document.createElement("td");
            column.setAttribute("id", String.fromCharCode(65 + i) + "" + (j + 1) + "salvo");
            column.setAttribute("data-id", String.fromCharCode(65 + i) + "" + (j + 1));
            let n = getParams();
            for (let k = 0; k < item.salvoes.length; k++) {
                if (item.salvoes[k].gamePlayerId == n) {
                    for (let l = 0; l < item.salvoes[k].gamePlayerSalvoes.length; l++) {
                        for (let m = 0; m < item.salvoes[k].gamePlayerSalvoes[l].locations.length; m++) {
                            if (String.fromCharCode(65 + i) + "" + (j + 1) == item.salvoes[k].gamePlayerSalvoes[l].locations[m]) {
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
    let container = document.querySelector("#grid");
    for (let i = 0; i < 10; i++) {
        let row = document.createElement("tr");
        container.appendChild(row);
        let firstCol = document.createElement("td");
        firstCol.innerHTML = String.fromCharCode(65 + i);
        row.appendChild(firstCol);
        for (let j = 0; j < 10; j++) {
            let column = document.createElement("td");
            column.setAttribute("id", String.fromCharCode(65 + i) + "" + (j + 1));
            for (let k = 0; k < item.ships.length; k++) {
                for (let l = 0; l < item.ships[k].locations.length; l++) {
                    if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l]) {
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
    document.getElementById("ship5Pos").addEventListener("change", function () {adjustPosition("ship5", "airCarrier")});
    document.getElementById("ship4Pos").addEventListener("change", function () {adjustPosition("ship4", "battleship")});
    document.getElementById("ship3SubPos").addEventListener("change", function () {adjustPosition("ship3sub", "submarine")});
    document.getElementById("ship3DestPos").addEventListener("change", function () {adjustPosition("ship3dest", "destroyer")});
    document.getElementById("ship2Pos").addEventListener("change", function () {adjustPosition("ship2", "patBoat")});
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
            if (document.getElementById(item.ships[i].hits[j]).getAttribute("class") == "ship") {
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
    let container = document.getElementById("historyTable");
    let n = getParams();
    for (let i = 0; i < item.history[0].gamePlayerHitsSinks.length; i++) {
        let arrMeHits = [];
        let arrOppHits = [];
        let arrSinksMe = [];
        let arrSinksOpp = [];
        let meShipsLeft = [];
        let oppShipsLeft = [];
        let row = document.createElement("tr");
        container.appendChild(row);
        let turn = row.insertCell();
        let hitsOnMe = row.insertCell();
        hitsOnMe.setAttribute("class", "you");
        let myLeft = row.insertCell();
        myLeft.setAttribute("class", "you");
        let hitsOnOpp = row.insertCell();
        let oppLeft = row.insertCell();

        for (let j = 0; j < 2; j++) {
            if (item.history[j].gamePlayerId == n) {
                let sortMeTurns = item.history[j].gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
                if (sortMeTurns[i].hits.AircraftCarrier != 0) {arrMeHits.push("Aircraft Carrier: " + sortMeTurns[i].hits.AircraftCarrier + ", ")};
                if (sortMeTurns[i].hits.Battleship != 0) {arrMeHits.push("Battleship: " + sortMeTurns[i].hits.Battleship + ", ")};
                if (sortMeTurns[i].hits.Destroyer != 0) {arrMeHits.push("Destroyer: " + sortMeTurns[i].hits.Destroyer + ", ")};
                if (sortMeTurns[i].hits.Submarine != 0) {arrMeHits.push("Submarine: " + sortMeTurns[i].hits.Submarine + ", ")};
                if (sortMeTurns[i].hits.PatrolBoat != 0) {arrMeHits.push("Patrol Boat: " + sortMeTurns[i].hits.PatrolBoat + ", ")};

                if (sortMeTurns[i].sinks.AircraftCarrier == "sunk" && sortMeTurns[i - 1].sinks.AircraftCarrier != "sunk") {arrSinksMe.push(" | Aircraft Carrier sunk")};
                if (sortMeTurns[i].sinks.Battleship == "sunk" && sortMeTurns[i - 1].sinks.Battleship != "sunk") {arrSinksMe.push(" | Battleship sunk")};
                if (sortMeTurns[i].sinks.Destroyer == "sunk" && sortMeTurns[i - 1].sinks.Destroyer != "sunk") {arrSinksMe.push(" | Destroyer sunk")};
                if (sortMeTurns[i].sinks.Submarine == "sunk" && sortMeTurns[i - 1].sinks.Submarine != "sunk") {arrSinksMe.push(" | Submarine sunk")};
                if (sortMeTurns[i].sinks.PatrolBoat == "sunk" && sortMeTurns[i - 1].sinks.PatrolBoat != "sunk") {arrSinksMe.push(" | Patrol Boat sunk")};
                meShipsLeft.push(sortMeTurns[i].sinks.left);
            }
            if (item.history[j].gamePlayerId != n) {
                let sortOppTurns = item.history[j].gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
                if (sortOppTurns[i].hits.AircraftCarrier != 0) {arrOppHits.push("Aircraft Carrier: " + sortOppTurns[i].hits.AircraftCarrier + ", ")};
                if (sortOppTurns[i].hits.Battleship != 0) {arrOppHits.push("Battleship: " + sortOppTurns[i].hits.Battleship + ", ")};
                if (sortOppTurns[i].hits.Destroyer != 0) {arrOppHits.push("Destroyer: " + sortOppTurns[i].hits.Destroyer + ", ")};
                if (sortOppTurns[i].hits.Submarine != 0) {arrOppHits.push("Submarine: " + sortOppTurns[i].hits.Submarine + ", ")};
                if (sortOppTurns[i].hits.PatrolBoat != 0) {arrOppHits.push("Patrol Boat: " + sortOppTurns[i].hits.PatrolBoat + ", ")};

                if (sortOppTurns[i].sinks.AircraftCarrier == "sunk" && sortOppTurns[i - 1].sinks.AircraftCarrier != "sunk") {arrSinksOpp.push(" | Aircraft Carrier sunk")};
                if (sortOppTurns[i].sinks.Battleship == "sunk" && sortOppTurns[i - 1].sinks.Battleship != "sunk") {arrSinksOpp.push(" | Battleship sunk")};
                if (sortOppTurns[i].sinks.Destroyer == "sunk" && sortOppTurns[i - 1].sinks.Destroyer != "sunk") {arrSinksOpp.push(" | Destroyer sunk")};
                if (sortOppTurns[i].sinks.Submarine == "sunk" && sortOppTurns[i - 1].sinks.Submarine != "sunk") {arrSinksOpp.push(" | Submarine sunk")};
                if (sortOppTurns[i].sinks.PatrolBoat == "sunk" && sortOppTurns[i - 1].sinks.PatrolBoat != "sunk") {arrSinksOpp.push(" | Patrol Boat sunk")};
                oppShipsLeft.push(sortOppTurns[i].sinks.left);
            }
        }
        turn.innerHTML = i + 1;
        hitsOnMe.innerHTML = arrOppHits + arrSinksOpp;
        myLeft.innerHTML = oppShipsLeft;
        hitsOnOpp.innerHTML = arrMeHits + arrSinksMe;
        oppLeft.innerHTML = meShipsLeft;
    }
}


function showOppHits(item) {
    let n = getParams();
    for (let i = 0; i < 2; i++) {
        if (item.history[i].gamePlayerId == n) {
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
    let n = getParams();
    for (let i = 0; i < 2; i++) {
        if (item.history[i].gamePlayerId == n) {
            let sortArr = item.history[i].gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
            let num = sortArr.length - 1;
            let ships = ["AircraftCarrier", "Battleship", "Submarine", "Destroyer", "PatrolBoat"];
            for (let i = 0; i < ships.length; i++) {
                if (sortArr[num].sinks[ships[i]] == "sunk") {
                    for (let j = 0; j < sortArr[num].sinks[ships[i] + "Sunk"].length; j++) {
                        if (document.getElementById(sortArr[num].sinks[ships[i] + "Sunk"][j] + "salvo").classList.item(0) == "salvo") {
                            document.getElementById(sortArr[num].sinks[ships[i] + "Sunk"][j] + "salvo").className = "salvo oppSink";
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
            startReloading();
            break;
        case  "EnterSalvo":
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "auto";
                }
            }
            document.getElementById("salvoDone").style.visibility = 'visible';
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

