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
        showShipsGrid(myGame);
        showSalvoesGrid(myGame);
        //showShips(myGame);
        showPlayers(myGame);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
}

function showShipsGrid(item) {
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
                        let n = getParams();
                        //if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l]) {


                            for (let m = 0; m < item.salvoes.length; m++) {
                                if (item.salvoes[m].gamePlayerId != n) {
                                    for (let p = 0; p < item.salvoes[m].gamePlayerSalvoes.length; p++) {
                                        for (let r = 0; r < item.salvoes[m].gamePlayerSalvoes[p].locations.length; r++) {
                                            if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l] && String.fromCharCode(65 + i) + "" + (j + 1) != item.salvoes[m].gamePlayerSalvoes[p].locations[r]) {
                                                column.setAttribute("class", "ship");
                                            }
                                            else if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l] && String.fromCharCode(65 + i) + "" + (j + 1) == item.salvoes[m].gamePlayerSalvoes[p].locations[r]) {
                                                        column.innerHTML = item.salvoes[m].gamePlayerSalvoes[p].turn;
                                                        //String.fromCharCode(65 + i) + "" + (j + 1);
                                                        //column.setAttribute("class", "salvo");
                                            }
                                        }
                                    }
                                }
                            }




                        //}
                    }
                }
                row.appendChild(column);
            }
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
        for (j = 0; j < 10; j++) {
            let column = document.createElement("td");
            column.setAttribute("id", String.fromCharCode(65 + i) + "" + (j + 1));
            let n = getParams();
            for (let k = 0; k < item.salvoes.length; k++) {
                if (item.salvoes[k].gamePlayerId == n) {
                    for (let l = 0; l < item.salvoes[k].gamePlayerSalvoes.length; l++) {
                        for (let m = 0; m < item.salvoes[k].gamePlayerSalvoes[l].locations.length; m++) {
                            if (String.fromCharCode(65 + i) + "" + (j + 1) == item.salvoes[k].gamePlayerSalvoes[l].locations[m]) {
                                //column.innerHTML = "slv"
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






function showPlayers(item) {
    let container = document.querySelector("#players");
    for (let i = 0; i < item.gamePlayers.length; i++) {
       let onePl = document.createElement("span");
       let n = getParams();
       if (item.gamePlayers[i].id == n) {
           onePl.innerHTML = "You are: " + item.gamePlayers[i].player.email + " and play against: ";
           container.insertBefore(onePl, container.childNodes[1])
       }
       else {
           onePl.innerHTML = item.gamePlayers[i].player.email + " ";
           container.appendChild(onePl);
       }
    }
//    let verVer = document.createElement("span");
//    verVer.innerHTML = "versus ";
//    container.insertBefore(verVer, container.childNodes[1]);
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