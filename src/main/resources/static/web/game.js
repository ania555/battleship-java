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
        //showShipsGrid(myGame);
        showSalvoesGrid(myGame);
        showShips(myGame);
        showPlayers(myGame);
        listenLogout();
        onlyShips(myGame);
        onlySalvoes(myGame);
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

                            for (let m = 0; m < item.salvoes.length; m++) {
                                if (item.salvoes[m].gamePlayerId != n) {
                                    for (let p = 0; p < item.salvoes[m].gamePlayerSalvoes.length; p++) {
                                        for (let r = 0; r < item.salvoes[m].gamePlayerSalvoes[p].locations.length; r++) {
                                            if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l] && String.fromCharCode(65 + i) + "" + (j + 1) != item.salvoes[m].gamePlayerSalvoes[p].locations[r]) {
                                                column.setAttribute("class", "ship");
                                            }
                                            else if (String.fromCharCode(65 + i) + "" + (j + 1) == item.ships[k].locations[l] && String.fromCharCode(65 + i) + "" + (j + 1) == item.salvoes[m].gamePlayerSalvoes[p].locations[r]) {
                                                        column.innerHTML = item.salvoes[m].gamePlayerSalvoes[p].turn;
                                            }
                                        }
                                    }
                                }
                            }

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

function listenLogout() {
    console.log("listen");
    document.querySelector("#logout").addEventListener("click", function () {logoutPlayer()});
    document.getElementById("ship5").addEventListener("click", function () {adjustPosition("ship5", "airCarrier")});
    document.getElementById("ship4").addEventListener("click", function () {adjustPosition("ship4", "battleship")});
    document.getElementById("ship3sub").addEventListener("click", function () {adjustPosition("ship3sub", "submarine")});
    document.getElementById("ship3dest").addEventListener("click", function () {adjustPosition("ship3dest", "destroyer")});
    document.getElementById("ship2").addEventListener("click", function () {adjustPosition("ship2", "patBoat")});
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

    let myData = JSON.stringify([ { "type": "destroyer", "locations": ["A1", "B1", "C1"] },
                   { "type": "patrol boat", "locations": ["H5", "H6"] },
                   { "type": "Aircraft Carrier", "locations": ["A3", "B3", "C3", "D3", "E3"] },
                   { "type": "Battleship", "locations": ["A8", "B8", "C8", "D8"] },
                   { "type": "Submarine", "locations": ["A10", "B10", "C10"] }
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
                       column.setAttribute("class", "ship");
                    }
                }
            }
            row.appendChild(column);
        }
    }
}
function onlySalvoes(item) {
    let n = getParams();
    for (let m = 0; m < item.salvoes.length; m++) {
       if (item.salvoes[m].gamePlayerId != n) {
           for (let p = 0; p < item.salvoes[m].gamePlayerSalvoes.length; p++) {
                for (let r = 0; r < item.salvoes[m].gamePlayerSalvoes[p].locations.length; r++) {
                    if (document.getElementById(item.salvoes[m].gamePlayerSalvoes[p].locations[r]).getAttribute("class") == "ship") {
                        document.getElementById(item.salvoes[m].gamePlayerSalvoes[p].locations[r]).innerHTML = item.salvoes[m].gamePlayerSalvoes[p].turn;
                    }
                }
           }
       }
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
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                      alert("Location not allowed");
                      return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC > 65 && letterASC < 75 - x) {
       for (i = 0; i < x + 2; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 9 && letterASC > 65 && letterASC < 75 - x) {
       for (i = 0; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 9 && letterASC == 65) {
       for (i = 1; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 9 && letterASC == 75 - x) {
       for (i = 0; i < x + 1; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC == 65) {
       for (i = 1; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC == 75 - x) {
       for (i = 0; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 10 && letterASC == 65) {
       for (i = 1; i < x + 2; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 10 && letterASC == 75 - x) {
       for (i = 0; i < x + 1; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
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
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.setAttribute("class", "placed");
            }
        }
        else if (shipHorVer("ship5") == "vertical") {
            for (let i = 1; i < 5; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).setAttribute("class", "placed");
            }
        }
    }
    else if (item == "battleship") {
        if (shipHorVer("ship4") == "horizontal") {
            for (let i = 0; i < 3; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.setAttribute("class", "placed");
            }
        }
        else if (shipHorVer("ship4") == "vertical") {
            for (let i = 1; i < 4; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).setAttribute("class", "placed");
            }
        }
    }
    else if (item == "submarine") {
        if (shipHorVer("ship3sub") == "horizontal") {
            for (let i = 0; i < 2; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.setAttribute("class", "placed");
            }
        }
        else if (shipHorVer("ship3sub") == "vertical") {
            for (let i = 1; i < 3; i++) {
               document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).setAttribute("class", "placed");
            }
        }
    }
    else if (item == "destroyer") {
        if (shipHorVer("ship3dest") == "horizontal") {
            for (let i = 0; i < 2; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.setAttribute("class", "placed");
            }
        }
        else if (shipHorVer("ship3dest") == "vertical") {
            for (let i = 1; i < 3; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).setAttribute("class", "placed");
            }
        }
    }
    else if (item == "patBoat") {
        if (shipHorVer("ship2") == "horizontal") {document.getElementById(place).nextSibling.setAttribute("class", "placed")}
        else if (shipHorVer("ship2") == "vertical") {document.getElementById(String.fromCharCode(letterASC + 1) + "" + (number).toString()).setAttribute("class", "placed");}
    }
    let cleanCell = document.getElementById(place)
    cleanCell.removeChild(cleanCell.childNodes[0]);
}



function checkLocationHor(letterASC, number, x) {
  if (number > 11 - x) {
     alert("Location not allowed");
     return false;
  }
  else if (number == 11 - x && letterASC > 65 && letterASC < 74) {
      for (i = 0; i < 3; i++) {
          for (let j = 0; j < x + 1; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number == 1 && letterASC > 65 && letterASC < 74) {
      for (i = 0; i < 3; i++) {
          for (let j = 1; j < x + 1; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number +j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number > 1 && number < 11 - x && letterASC > 65 && letterASC < 74) {
      for (i = 0; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number > 1 && number < 11 - x && letterASC == 65) {
      for (i = 1; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
      else if (number > 1 && number < 11 - x && letterASC == 74) {
          for (i = 0; i < 2; i++) {
              for (let j = 0; j < x + 2; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 1 && letterASC == 65) {
          for (i = 1; i < 3; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 1 && letterASC == 74) {
          for (i = 0; i < 2; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 11 - x && letterASC == 65) {
          for (i = 1; i < 3; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 11 - x && letterASC == 74) {
          for (i = 0; i < 2; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).getAttribute("class") == "placed" || document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()) == null) {
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
