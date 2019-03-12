import { getParams } from "./game.js"


export function listenSalvoes(item) {
    console.log("listen salvoes");
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").addEventListener("click", function () {setShot(this.getAttribute("id"))});
        }
    }
    document.getElementById("salvoDone").addEventListener("click", function () {sendSalvo(item)});
}

function setShot(item) {
    let myShot = document.getElementById(item);
    let shotList = document.querySelectorAll(".shot");
    if (myShot.getAttribute("class") == "shot") {myShot.removeAttribute("class")}
    else if (myShot.getAttribute("class") != "salvo" && shotList.length < 3) {myShot.setAttribute("class", "shot")}
    else if (myShot.getAttribute("class") != "salvo" && shotList.length >= 3) {alert("You have already fired all shots for this turn"); return false;}
    else if (myShot.getAttribute("class") == "salvo" && shotList.length < 3) {alert("This location has already been shot"); return false;}
    else if (myShot.getAttribute("class") == "salvo" && shotList.length >= 3) {alert("You have already fired all shots for this turn"); return false;}

}

function getSalvoLocations() {
    let arrSalvo = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").getAttribute("class") == "shot") {
                arrSalvo.push(String.fromCharCode(65 + i) + "" + (j + 1));
            }
        }
    }
    return arrSalvo;

}


function sendSalvo(item) {
    let n = getParams();
    let me;
    console.log("send salvo");
    for (let i = 0; i < item.history.length; i++) {
        if (item.history[i].gamePlayerId == n)  me = item.history[i];
    }
    let myData = JSON.stringify({ "turnNumber": me.gamePlayerHitsSinks.length + 1, "locations": getSalvoLocations() /*["A1", "B1", "C1"] */});
    const url = "/api/games/players/" + getParams() + "/salvoes";

    fetch(url, {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/json',
    Accept: "application/json"
    },
    method: 'POST',
    body: myData,
    })
    .then((data) => {
        console.log('Request success: ', data);
        return data.json()
    })
    .then((json) => {
        console.log(json)
        //location.reload();
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    })
}
