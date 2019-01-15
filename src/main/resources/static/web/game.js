loadData()
var ooo = window.location.search;
console.log(ooo);

function getParams() {
  var obj = {};
  var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

  window.location.search.replace(reg, function(match, param, val) {
    obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
  });
  console.log(obj.gp);
  return obj.gp;
}

function loadData() {
let url = " http://localhost:8080/api/game_view/" + getParams();
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        //console.log(json);
        var myGame = json;
        console.log(myGame);
        showGame(myGame);
        showShips(myGame);
        showPlayers(myGame);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function showGame(item) {
    let container = document.querySelector("#grid");
        for (let i = 0; i < 10; i++ ) {
            let row = document.createElement("tr");
            container.appendChild(row);
            let firstCol = document.createElement("td");
            firstCol.innerHTML = String.fromCharCode(65 + i);
            row.appendChild(firstCol);
            for (j = 0; j < 10; j++) {
                let column = document.createElement("td");
                column.setAttribute("id", String.fromCharCode(65 + i) + "" + (j + 1));
                for (let k = 0; k < item.ships.length; k++) {
                    for (let l = 0; l < item.ships[k].locations.length; l++) {
                        if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l]) {
                            column.innerHTML = String.fromCharCode(65 + i) + "" + (j + 1);
                        }
                    }
                }
                row.appendChild(column);
            }
        }
}

function showPlayers(item) {
    let container = document.querySelector("#players");
    for (let i = 0; i < item.gamePlayers.length; i++) {
       let onePl = document.createElement("span");
       onePl.innerHTML = item.gamePlayers[i].player.email + " ";
       container.appendChild(onePl);
    }
    let verVer = document.createElement("span");
    verVer.innerHTML = "(you)  versus ";
    container.insertBefore(verVer, container.childNodes[1]);
}

function showShips(item) {
    let container = document.querySelector("#ship");
    for (let i = 0; i < item.ships.length; i++) {
        console.log("ship");
        let oneShip = document.createElement("p");
        oneShip.innerHTML = item.ships[i].locations;
        container.appendChild(oneShip);
    }
}