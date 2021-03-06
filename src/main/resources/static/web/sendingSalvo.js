import { getParams } from "./game.js"


export function listenSalvoes(item) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").addEventListener("click", function () {setShot(this.getAttribute("id"))});
        }
    }
    document.getElementById("salvoDone").addEventListener("click", function () {sendSalvo(item)});
}


function setShot(item) {
    const myShot = document.getElementById(item);
    const shotList = document.querySelectorAll(".shot");
    if (myShot.getAttribute("class") === "shot") {myShot.removeAttribute("class")}
    else if (myShot.classList.item(0) !== "salvo" && shotList.length < 3) {myShot.setAttribute("class", "shot")}
    else if (myShot.classList.item(0) !== "salvo" && shotList.length >= 3) {alert("You can fire maximal 3 shots for each turn"); return false;}
    else if (myShot.classList.item(0) === "salvo"  && shotList.length < 3) {alert("This location has already been shot"); return false;}
    else if (myShot.classList.item(0) === "salvo" && shotList.length >= 3) {alert("You can fire maximal 3 shots for each turn"); return false;}

}

function getSalvoLocations() {
    const arrSalvo = [];
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
    const n = getParams();
    let me;
    for (let i = 0; i < item.history.length; i++) {
        if (item.history[i].gamePlayerId === Number(n))  me = item.history[i];
    }
    const myData = JSON.stringify({ "turnNumber": me.gamePlayerHitsSinks.length + 1, "locations": getSalvoLocations() /*["A1", "B1", "C1"] */});
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
        location.reload();
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    })
}
