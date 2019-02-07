loadData()
loadPlayer()
var ooo = window.location.search;
console.log(ooo);

function getParams() {
  //var obj = {};
  //var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

let ppp = window.location.search;
let last = ppp.indexOf("p") + 1;
let size = ppp.length;
let result = ppp.slice(last, size);

 /*window.location.search.replace(reg, function(match, param, val) {
      obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
    });*/
  console.log(result);
  return result;
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
        showSalvoesGrid(myGame);
        showPlayers(myGame);
        listenLogout();
        onlyShips(myGame);
        onlySalvoesOnMe(myGame);
        listenShipsGrid(myGame);
        displayShipPlacement(myGame);
        listenSalvoes(myGame);
        displayGameState(myGame);
        showOppHits(myGame);
        showOppSinks(myGame);
        sinksOnMe(myGame);
        hitsSinksTable(myGame);
        //makeTurnsTable(myGame);
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
        var myPlayer = json.player;
        console.log(myPlayer);
        showLoggedUser(myPlayer);
    })
    .catch((error) => {
        console.log("Request failed: " + error.message)
    })
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


function showPlayers(item) {
    let container = document.querySelector("#players");
    for (let i = 0; i < item.gamePlayers.length; i++) {
        let n = getParams();
        if (item.gamePlayers[i].id == n) {document.getElementById("you").innerHTML = item.gamePlayers[i].player.email}
        if (item.gamePlayers[i].id != n) {document.getElementById("opponent").innerHTML = item.gamePlayers[i].player.email}
    }
}


function listenLogout() {
    console.log("listen");
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
    document.getElementById("ship5").addEventListener("click", function () {adjustPosition("ship5", "airCarrier")});
    document.getElementById("ship4").addEventListener("click", function () {adjustPosition("ship4", "battleship")});
    document.getElementById("ship3sub").addEventListener("click", function () {adjustPosition("ship3sub", "submarine")});
    document.getElementById("ship3dest").addEventListener("click", function () {adjustPosition("ship3dest", "destroyer")});
    document.getElementById("ship2").addEventListener("click", function () {adjustPosition("ship2", "patBoat")});
    document.getElementById("done").addEventListener("click", function () {checkShipsPlacement()});
}

function logoutPlayer() {
    console.log("logout");

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


function sendShips() {
    console.log("create ships");

    let myData = JSON.stringify([ { "type": "Destroyer", "locations": getShipLocation("placedDest") /*["A1", "B1", "C1"] */},
                   { "type": "Patrol Boat", "locations": getShipLocation("placedBoat") /*["H5", "H6"] */},
                   { "type": "Aircraft Carrier", "locations": getShipLocation("placedCarr") /*["A3", "B3", "C3", "D3", "E3"] */},
                   { "type": "Battleship", "locations": getShipLocation("placedBattle") /*["A8", "B8", "C8", "D8"] */},
                   { "type": "Submarine", "locations": getShipLocation("placedSub") /*["A10", "B10", "C10"] */}
                 ]);
    const url = "/api/games/players/" + getParams() + "/ships";

    fetch(url, {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/json',
    Accept: "application/json"
    },
    method: 'POST',
    body: myData,
    })
    .then(function (data) {
    console.log('Request success: ', data);
    return data.json()
    }).then(function (json) {
    console.log(json)
    location.reload();
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function onlyShips(item) {
    let container = document.querySelector("#grid");
    for (let i = 0; i < 10; i++) {
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
                       column.setAttribute("class", "ship");
                    }
                }
            }
            row.appendChild(column);
        }
    }
}
function onlySalvoesOnMe(item) {
    let n = getParams();
    for (let m = 0; m < item.salvoes.length; m++) {
       if (item.salvoes[m].gamePlayerId != n) {
           for (let p = 0; p < item.salvoes[m].gamePlayerSalvoes.length; p++) {
                for (let r = 0; r < item.salvoes[m].gamePlayerSalvoes[p].locations.length; r++) {
                    if (document.getElementById(item.salvoes[m].gamePlayerSalvoes[p].locations[r]).getAttribute("class") == "ship") {
                        document.getElementById(item.salvoes[m].gamePlayerSalvoes[p].locations[r]).style.backgroundImage = "radial-gradient(circle, red 10%, #5c8a8a 60%, #5c8a8a 30%)";
                        //innerHTML = item.salvoes[m].gamePlayerSalvoes[p].turn;
                    }
                }
           }
       }
    }
}


function sinksOnMe(item) {
    let allOppSalvLocs = [];
    let n = getParams();
    for (let m = 0; m < item.salvoes.length; m++) {
        if (item.salvoes[m].gamePlayerId != n) {
            for (let p = 0; p < item.salvoes[m].gamePlayerSalvoes.length; p++) {
                for (let r = 0; r < item.salvoes[m].gamePlayerSalvoes[p].locations.length; r++) {
                    allOppSalvLocs.push(item.salvoes[m].gamePlayerSalvoes[p].locations[r]);
                }
            }
        }
    }
    let arrShip = [];
    for (let i = 0; i < item.ships.length; i++) {
        for (let j = 0; j < item.ships[i].locations.length; j++) {
            if (allOppSalvLocs.includes(item.ships[i].locations[j])) {arrShip.push(item.ships[i].locations[j])}
        }
        if (arrShip.length == item.ships[i].locations.length) {
            for (let j = 0; j < item.ships[i].locations.length; j++) {
            document.getElementById(item.ships[i].locations[j]).style.backgroundImage = "radial-gradient(circle, red 10%, #000c29 60%, #000c29 30%)";
        }
        }
        arrShip = [];
    }
}


function shipHorVer(item) {
    console.log("position")
    let findShip = document.getElementById(item);
    let positShip = findShip.ship.value
    if (positShip == "horizontal") {return "horizontal"}
    else if (positShip == "vertical") {return "vertical"}
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  let start = ev.target.getAttribute("id");
  console.log(start);
  console.log(shipHorVer("ship5"));
  let letterASC = start.charCodeAt(0);
  //console.log(letterASC);
  let number = Number(start.slice(1, 3));
  if (data == "airCarrier") {
      if (shipHorVer("ship5") == "horizontal") {if (checkLocationHor(letterASC, number, 5) == false) {return false}}
      else if (shipHorVer("ship5") == "vertical") {if (checkLocationVer(letterASC, number, 5) == false) {return false}}
  }
  if (data == "battleship") {
      if (shipHorVer("ship4") == "horizontal") {if (checkLocationHor(letterASC, number, 4) == false) {return false}}
      else if (shipHorVer("ship4") == "vertical") {if (checkLocationVer(letterASC, number, 4) == false) {return false}}
  }
  if (data == "submarine") {
      if (shipHorVer("ship3sub") == "horizontal"){if (checkLocationHor(letterASC, number, 3) == false){return false}}
      else if (shipHorVer("ship3sub") == "vertical") {if (checkLocationVer(letterASC, number, 3) == false) {return false}}
  }
  if (data == "destroyer") {
      if (shipHorVer("ship3dest") == "horizontal") {if (checkLocationHor(letterASC, number, 3) == false){return false}}
      else if (shipHorVer("ship3dest") == "vertical") {if (checkLocationVer(letterASC, number, 3) == false) {return false}}
  }
  if (data == "patBoat") {
      if (shipHorVer("ship2") == "horizontal") {if (checkLocationHor(letterASC, number, 2) == false) {return false}}
      else if (shipHorVer("ship2") == "vertical") {if (checkLocationVer(letterASC, number, 2) == false) {return false}}
  }
  ev.target.appendChild(document.getElementById(data));
  document.getElementById(data).style.width = "35px";
  document.getElementById(start).setAttribute("class", "placed");
  console.log(data);
  console.log(start);
  placeRest(start, data);
}



function checkLocationVer(letterASC, number, x) {

   if (letterASC > 75 - x) {
       alert("Location not allowed");
       return false;
   }
   else if (number == 10 && letterASC > 65 && letterASC < 75 - x) {
       for (i = 0; i < x + 2; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC > 65 && letterASC < 75 - x) {
       for (i = 0; i < x + 2; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC > 65 && letterASC < 75 - x) {
       for (i = 0; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC == 65) {
       for (i = 1; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC == 75 - x) {
       for (i = 0; i < x + 1; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC == 65) {
       for (i = 1; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC == 75 - x) {
       for (i = 0; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 10 && letterASC == 65) {
       for (i = 1; i < x + 2; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 10 && letterASC == 75 - x) {
       for (i = 0; i < x + 1; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
}


function  placeRest(place, item) {
    console.log("rest");
    let letter = place.slice(0, 1);
    let number = Number(place.slice(1, 3));
    let letterASC = place.charCodeAt(0);
    console.log(letter);
    console.log(number);
    console.log(letter + "" + (number + 1).toString())
    if (item == "airCarrier") {
        if (shipHorVer("ship5") == "horizontal") {
            for (let i = 0; i < 4; i++) {
                //document.getElementById(letter + "" + (number + i).toString()).nextSibling.setAttribute("class", "placed");
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedCarr";
            }
            document.getElementById(place).className += " placedCarr";
        }
        else if (shipHorVer("ship5") == "vertical") {
            for (let i = 1; i < 5; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedCarr";
            }
            document.getElementById(place).className += " placedCarr";
        }
    }
    else if (item == "battleship") {
        if (shipHorVer("ship4") == "horizontal") {
            for (let i = 0; i < 3; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedBattle";
            }
            document.getElementById(place).className += " placedBattle";
        }
        else if (shipHorVer("ship4") == "vertical") {
            for (let i = 1; i < 4; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedBattle";
            }
            document.getElementById(place).className += " placedBattle";
        }
    }
    else if (item == "submarine") {
        if (shipHorVer("ship3sub") == "horizontal") {
            for (let i = 0; i < 2; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedSub";
            }
            document.getElementById(place).className += " placedSub";
        }
        else if (shipHorVer("ship3sub") == "vertical") {
            for (let i = 1; i < 3; i++) {
               document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedSub";
            }
            document.getElementById(place).className += " placedSub";
        }
    }
    else if (item == "destroyer") {
        if (shipHorVer("ship3dest") == "horizontal") {
            for (let i = 0; i < 2; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedDest";
            }
            document.getElementById(place).className += " placedDest";
        }
        else if (shipHorVer("ship3dest") == "vertical") {
            for (let i = 1; i < 3; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedDest";
            }
            document.getElementById(place).className += " placedDest";
        }
    }
    else if (item == "patBoat") {
        if (shipHorVer("ship2") == "horizontal") {
        document.getElementById(place).nextSibling.className = "placed placedBoat";
        document.getElementById(place).className += " placedBoat";
        }
        else if (shipHorVer("ship2") == "vertical") {
        document.getElementById(String.fromCharCode(letterASC + 1) + "" + (number).toString()).className = "placed placedBoat";
        document.getElementById(place).className += " placedBoat";
        }
    }
    let cleanCell = document.getElementById(place)
    cleanCell.removeChild(cleanCell.childNodes[0]);

    document.getElementById("B5").classList.item(0);

}



function checkLocationHor(letterASC, number, x) {
  if (number > 11 - x) {
     alert("Location not allowed");
     return false;
  }
  else if (number == 11 - x && letterASC > 65 && letterASC < 74) {
      for (i = 0; i < 3; i++) {
          for (let j = 0; j < x + 1; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number == 1 && letterASC > 65 && letterASC < 74) {
      for (i = 0; i < 3; i++) {
          for (let j = 1; j < x + 1; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number +j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number > 1 && number < 11 - x && letterASC > 65 && letterASC < 74) {
      for (i = 0; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number > 1 && number < 11 - x && letterASC == 65) {
      for (i = 1; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
      else if (number > 1 && number < 11 - x && letterASC == 74) {
          for (i = 0; i < 2; i++) {
              for (let j = 0; j < x + 2; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 1 && letterASC == 65) {
          for (i = 1; i < 3; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 1 && letterASC == 74) {
          for (i = 0; i < 2; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 11 - x && letterASC == 65) {
          for (i = 1; i < 3; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 11 - x && letterASC == 74) {
          for (i = 0; i < 2; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
  }

function adjustPosition(form, ship) {
    let myShip = document.getElementById(ship);
    let widTh = window.getComputedStyle(myShip, null).getPropertyValue("width");
    let heigHt = window.getComputedStyle(myShip, null).getPropertyValue("height");
    myShip.style.width = heigHt;
    myShip.style.height = widTh;
}

function getShipLocation(item) {
    let xxx = document.getElementById("B5").classList.item(0);
    console.log(xxx);
    let arrShip = [];
    for (let i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (document.getElementById(String.fromCharCode(65 + i) + "" + (1 + j).toString()).classList.item(1) == item) {
                arrShip.push(String.fromCharCode(65 + i) + "" + (1 + j).toString());
            }
        }
    }
    return arrShip;
}

function displayShipPlacement(item) {
    if (item.ships.length < 5) {
        document.getElementById("shipPlacement").style.visibility = 'visible';
        document.getElementById("salvoesSubmission").style.visibility = 'hidden';
        document.getElementById("gameHistory").style.visibility = 'hidden';
        document.getElementById("statusMessage").innerHTML = "Place your ships"
        }
    else if (item.ships.length == 5 && item.ships[0].locations.length > 1 && item.ships[1].locations.length > 1) {
        document.getElementById("shipPlacement").style.visibility = 'hidden';
        document.getElementById("salvoesSubmission").style.visibility = 'visible';
        document.getElementById("gameHistory").style.visibility = 'visible';
    }
}

function checkShipsPlacement() {
    if (document.getElementById("airCarrier") == null
        && document.getElementById("battleship") == null
        && document.getElementById("submarine") == null
        && document.getElementById("destroyer") == null
        && document.getElementById("patBoat") == null) {sendShips()}
    else {alert("Place all ships"); return false;}
}

function listenShipsGrid(item) {
    console.log("listen ships");
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).addEventListener("click", function () {removeShip(this.getAttribute("id"))});
        }
    }
}

function removeShip(idItem) {
    console.log("removing");
    let myShip = document.getElementById(idItem).getAttribute("class");
    console.log(myShip);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).getAttribute("class") == myShip) {
                document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).removeAttribute("class");
            }
        }
    }
    if (myShip == "placed placedCarr") {
        let container = document.getElementById("airCarrierDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "airCarrier");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
    }
    if (myShip == "placed placedBattle") {
        let container = document.getElementById("battleshipDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "battleship");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
    }
    if (myShip == "placed placedSub") {
        let container = document.getElementById("submarineDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "submarine");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
}
    if (myShip == "placed placedDest") {
        let container = document.getElementById("destroyerDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "destroyer");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
    }
    if (myShip == "placed placedBoat") {
        let container = document.getElementById("patBoatDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "patBoat");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
    }
}


function listenSalvoes(item) {
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
    console.log(shotList.length);
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
    .then(function (data) {
    console.log('Request success: ', data);
    return data.json()
    }).then(function (json) {
    console.log(json)
    location.reload();
    })
    .catch(function (error) {
    console.log('Request failure: ', error);
    });
}

function makeTurnsTable(item) {
    let container = document.getElementById("historyTable");
    let n = getParams();
    let me;
    let opponent;
    for (let j = 0; j < 2; j++) {
       if (item.history[j].gamePlayerId == n)  me = item.history[j];
       if (item.history[j].gamePlayerId != n) opponent = item.history[j];
    }
    console.log(me.gamePlayerId);
    console.log(opponent.gamePlayerId);
    let meGmPlHitsSinksSorted = me.gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
    let oppGmPlHitsSinksSorted = opponent.gamePlayerHitsSinks.sort((a, b) => a.turn - b.turn);
    for (let i = 0; i < 5; i++) {
        let row = document.createElement("tr");
        container.appendChild(row);
        let turn = row.insertCell();
        let hitsOnMe = row.insertCell();
        let myLeft = row.insertCell();
        let hitsOnOpp = row.insertCell();
        let oppLeft = row.insertCell();
        hitsOnMe.setAttribute("class", "hitsCells") ;
        hitsOnOpp.setAttribute("class", "hitsCells");
        let arrMeHits = [];
        let arrOppHits = [];
        let arrSinksMe = [];
        let arrSinksOpp = [];

        if (meGmPlHitsSinksSorted[i].hits.AircraftCarrier != 0) {arrMeHits.push("Aircraft Carrier: " + meGmPlHitsSinksSorted[i].hits.AircraftCarrier + ", ")};
        if (meGmPlHitsSinksSorted[i].hits.Battleship != 0) {arrMeHits.push("Battleship: " + meGmPlHitsSinksSorted[i].hits.Battleship + ", ")};
        if (meGmPlHitsSinksSorted[i].hits.Destroyer != 0) {arrMeHits.push("Destroyer: " + meGmPlHitsSinksSorted[i].hits.Destroyer + ", ")};
        if (meGmPlHitsSinksSorted[i].hits.Submarine != 0) {arrMeHits.push("Submarine: " + meGmPlHitsSinksSorted[i].hits.Submarine + ", ")};
        if (meGmPlHitsSinksSorted[i].hits.PatrolBoat != 0) {arrMeHits.push("Patrol Boat: " + meGmPlHitsSinksSorted[i].hits.PatrolBoat + ", ")};

        if (oppGmPlHitsSinksSorted[i].hits.AircraftCarrier != 0) {arrOppHits.push("Aircraft Carrier: " + oppGmPlHitsSinksSorted[i].hits.AircraftCarrier + ", ")};
        if (oppGmPlHitsSinksSorted[i].hits.Battleship != 0) {arrOppHits.push("Battleship: " + oppGmPlHitsSinksSorted[i].hits.Battleship + ", ")};
        if (oppGmPlHitsSinksSorted[i].hits.Destroyer != 0) {arrOppHits.push("Destroyer: " + oppGmPlHitsSinksSorted[i].hits.Destroyer + ", ")};
        if (oppGmPlHitsSinksSorted[i].hits.Submarine != 0) {arrOppHits.push("Submarine: " + oppGmPlHitsSinksSorted[i].hits.Submarine + ", ")};
        if (oppGmPlHitsSinksSorted[i].hits.PatrolBoat != 0) {arrOppHits.push("Patrol Boat: " + oppGmPlHitsSinksSorted[i].hits.PatrolBoat + ", ")};

        if (meGmPlHitsSinksSorted[i].sinks.AircraftCarrier == "sunk" && meGmPlHitsSinksSorted[i - 1].sinks.AircraftCarrier != "sunk") {arrSinksMe.push(" | Aircraft Carrier sunk")};
        if (meGmPlHitsSinksSorted[i].sinks.Battleship == "sunk" && meGmPlHitsSinksSorted[i - 1].sinks.Battleship != "sunk") {arrSinksMe.push(" | Battleship sunk")};
        if (meGmPlHitsSinksSorted[i].sinks.Destroyer == "sunk" && meGmPlHitsSinksSorted[i - 1].sinks.Destroyer != "sunk") {arrSinksMe.push(" | Destroyer sunk")};
        if (meGmPlHitsSinksSorted[i].sinks.Submarine == "sunk" && meGmPlHitsSinksSorted[i - 1].sinks.Submarine != "sunk") {arrSinksMe.push(" | Submarine sunk")};
        if (meGmPlHitsSinksSorted[i].sinks.PatrolBoat == "sunk" && meGmPlHitsSinksSorted[i - 1].sinks.PatrolBoat != "sunk") {arrSinksMe.push(" | Patrol Boat sunk")};

        if (oppGmPlHitsSinksSorted[i].sinks.AircraftCarrier == "sunk" && oppGmPlHitsSinksSorted[i - 1].sinks.AircraftCarrier != "sunk") {arrSinksOpp.push(" | Aircraft Carrier sunk")};
        if (oppGmPlHitsSinksSorted[i].sinks.Battleship == "sunk" && oppGmPlHitsSinksSorted[i - 1].sinks.Battleship != "sunk") {arrSinksOpp.push(" | Battleship sunk")};
        if (oppGmPlHitsSinksSorted[i].sinks.Destroyer == "sunk" && oppGmPlHitsSinksSorted[i - 1].sinks.Destroyer != "sunk") {arrSinksOpp.push(" | Destroyer sunk")};
        if (oppGmPlHitsSinksSorted[i].sinks.Submarine == "sunk" && oppGmPlHitsSinksSorted[i - 1].sinks.Submarine != "sunk") {arrSinksOpp.push(" | Submarine sunk")};
        if (oppGmPlHitsSinksSorted[i].sinks.PatrolBoat == "sunk" && oppGmPlHitsSinksSorted[i - 1].sinks.PatrolBoat != "sunk") {arrSinksOpp.push(" | Patrol Boat sunk")};

        turn.innerHTML = meGmPlHitsSinksSorted[i].turn;
        hitsOnMe.innerHTML = arrOppHits + arrSinksOpp;
        myLeft.innerHTML = opponent.gamePlayerHitsSinks[i].sinks.left;
        hitsOnOpp.innerHTML = arrMeHits + arrSinksMe;
        oppLeft.innerHTML = me.gamePlayerHitsSinks[i].sinks.left;
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
        let myLeft = row.insertCell();
        let hitsOnOpp = row.insertCell();
        let oppLeft = row.insertCell();
        hitsOnMe.setAttribute("class", "hitsCells") ;
        hitsOnOpp.setAttribute("class", "hitsCells");

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
console.log("hiiits");
    let n = getParams();
    for (let i = 0; i < 2; i++) {
        if (item.history[i].gamePlayerId == n) {
            for (let j = 0; j <item.history[i].gamePlayerHitsSinks.length; j++) {
                for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].hits.hitsLocations.length; k++) {
                    if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].hits.hitsLocations[k] + "salvo").getAttribute("class") == "salvo") {
                        document.getElementById(item.history[i].gamePlayerHitsSinks[j].hits.hitsLocations[k] + "salvo").style.backgroundImage = "radial-gradient(circle, red 10%, #003566 60%, #003566 30%)";
                        //innerHTML = item.history[i].gamePlayerHitsSinks[j].turn;
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
            for (let j = 0; j < item.history[i].gamePlayerHitsSinks.length; j++) {
                if (item.history[i].gamePlayerHitsSinks[j].sinks.AircraftCarrier == "sunk") {
                    for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].sinks.AirCarLoc.length; k++) {
                        if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.AirCarLoc[k] + "salvo").getAttribute("class") == "salvo") {
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.AirCarLoc[k] + "salvo").style.backgroundImage = "radial-gradient(circle, red 10%, #000c29 60%, #000c29 30%)";
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.AirCarLoc[k] + "salvo").style.borderColor = "rgb(0, 53, 102)";
                        }
                    }
                }
                if (item.history[i].gamePlayerHitsSinks[j].sinks.Battleship == "sunk") {
                    for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].sinks.BattleshipLoc.length; k++) {
                        if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.BattleshipLoc[k] + "salvo").getAttribute("class") == "salvo") {
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.BattleshipLoc[k] + "salvo").style.backgroundImage = "radial-gradient(circle, red 10%, #000c29 60%, #000c29 30%)";
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.BattleshipLoc[k] + "salvo").style.borderColor = "rgb(0, 53, 102)";
                        }
                    }
                }
                if (item.history[i].gamePlayerHitsSinks[j].sinks.Submarine == "sunk") {
                    for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].sinks.SubmarLoc.length; k++) {
                        if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.SubmarLoc[k] + "salvo").getAttribute("class") == "salvo") {
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.SubmarLoc[k] + "salvo").style.backgroundImage = "radial-gradient(circle, red 10%, #000c29 60%, #000c29 30%)";
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.SubmarLoc[k] + "salvo").style.borderColor = "rgb(0, 53, 102)";
                        }
                    }
                }
                if (item.history[i].gamePlayerHitsSinks[j].sinks.Destroyer == "sunk") {
                    for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].sinks.Destloc.length; k++) {
                        if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.Destloc[k] + "salvo").getAttribute("class") == "salvo") {
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.Destloc[k] + "salvo").style.backgroundImage = "radial-gradient(circle, red 10%, #000c29 60%, #000c29 30%)";
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.Destloc[k] + "salvo").style.borderColor = "rgb(0, 53, 102)";
                        }
                    }
                }
                if (item.history[i].gamePlayerHitsSinks[j].sinks.PatrolBoat == "sunk") {
                    for (let k = 0; k < item.history[i].gamePlayerHitsSinks[j].sinks.PatBoatLoc.length; k++) {
                        if (document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.PatBoatLoc[k] + "salvo").getAttribute("class") == "salvo") {
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.PatBoatLoc[k] + "salvo").style.backgroundImage = "radial-gradient(circle, red 10%, #000c29 60%, #000c29 30%)";
                            document.getElementById(item.history[i].gamePlayerHitsSinks[j].sinks.PatBoatLoc[k] + "salvo").style.borderColor = "rgb(0, 53, 102)";
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
        let  timerId = setTimeout(function() { location.reload(); startReloading(); }, 5000);
    }
    function stopReloading() {
         clearTimeout(timerId);
    }
    if (item.gameState == "WaitForOpponentSalvo") {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "none";
            }
        }
        document.getElementById("salvoDone").style.visibility = 'hidden';
        document.getElementById("statusMessage").innerHTML = "Waiting for other player to fire salvo";
        startReloading()
    }
    else if (item.gameState == "EnterSalvo") {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "auto";
            }
        }
        document.getElementById("salvoDone").style.visibility = 'visible';
        document.getElementById("statusMessage").innerHTML = "Enter your salvo";
        stopReloading()
    }
    else if (item.gameState == "GameOver") {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1) + "salvo").style.pointerEvents = "none";
            }
        }
        document.getElementById("salvoDone").style.visibility = 'hidden';
        document.getElementById("statusMessage").innerHTML = "Game over"
        stopReloading()
    }
}