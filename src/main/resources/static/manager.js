loadData()
function loadData() {
let url = " http://localhost:8080/players";
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        var myPlayers = json._embedded.players;
        console.log(myPlayers);
        showPlayers(myPlayers);
        showJ(json);
        listenPlayer();
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function showPlayers(item) {
    console.log("a");
    var container = document.querySelector("#output");
    container.innerHTML = " ";
    for (var i = 0; i < item.length; i++) {
        var onePlayer = document.createElement("div");
        onePlayer.innerHTML = item[i].userName;
        container.appendChild(onePlayer);
        }
    }

function showJ(item) {
    var container = document.querySelector("#out-json");
    container.innerHTML = " ";
    var myJSON = JSON.stringify(item, null, 2);
    container.innerHTML = myJSON
}

function listenPlayer() {
    console.log("added");
    document.querySelector("#add_player").addEventListener("click", function () {addPlayer()});
}

function addPlayer() {
    console.log("result");
    var findInput = document.querySelector("#email");
    var user = findInput.value;
    console.log(user);
    if (user) {postPlayer(user)}
}

function postPlayer(userName) {
    let url = " http://localhost:8080/players";
    var data = JSON.stringify({ "userName": userName });
    let myHeaders = new Headers({
        "Content-Type": "application/json"
    });
    const myInit = {
        method: 'POST',
        headers: myHeaders,
        body: data
    };
    fetch(url, myInit)
    .then((response) => {
         loadData();
    })
}
