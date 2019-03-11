import { getParams } from "./game.js"


export function adjustPosition(form, ship) {
    let myShip = document.getElementById(ship);
    let widTh = window.getComputedStyle(myShip, null).getPropertyValue("width");
    let heigTh = window.getComputedStyle(myShip, null).getPropertyValue("height");
    myShip.style.width = heigTh;
    myShip.style.height = widTh;
}

function shipHorVer(item) {
    let check = document.getElementById(item).checked;
    if (check == true) {return "vertical"}
    else if (check == false) {return "horizontal"}
}

export function drag (ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

export function allowDrop(ev) {
  ev.preventDefault();
}

export function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  let start = ev.target.getAttribute("id");
  //console.log(start);
  //console.log(shipHorVer("ship5"));
  let letterASC = start.charCodeAt(0);
  //console.log(letterASC);
  let number = Number(start.slice(1, 3));
  switch (data) {
      case "airCarrier":
          if (shipHorVer("ship5Pos") == "horizontal" && checkLocationHor(letterASC, number, 5) == false) {return false};
          if (shipHorVer("ship5Pos") == "vertical" && checkLocationVer(letterASC, number, 5) == false) {return false};
          break;
      case "battleship":
          if (shipHorVer("ship4Pos") == "horizontal" && checkLocationHor(letterASC, number, 4) == false) {return false};
          if (shipHorVer("ship4Pos") == "vertical" && checkLocationVer(letterASC, number, 4) == false) {return false};
          break;
      case  "submarine":
          if (shipHorVer("ship3SubPos") == "horizontal" && checkLocationHor(letterASC, number, 3) == false){return false};
          if (shipHorVer("ship3SubPos") == "vertical" && checkLocationVer(letterASC, number, 3) == false) {return false};
          break;
      case "destroyer":
          if (shipHorVer("ship3DestPos") == "horizontal" && checkLocationHor(letterASC, number, 3) == false){return false};
          if (shipHorVer("ship3DestPos") == "vertical" && checkLocationVer(letterASC, number, 3) == false) {return false};
          break;
      case "patBoat":
          if (shipHorVer("ship2Pos") == "horizontal" && checkLocationHor(letterASC, number, 2) == false) {return false};
          if (shipHorVer("ship2Pos") == "vertical" && checkLocationVer(letterASC, number, 2) == false) {return false};
          break;
  }
  ev.target.appendChild(document.getElementById(data));
  document.getElementById(data).style.width = "33px";
  document.getElementById(start).setAttribute("class", "placed");
  placeRest(start, data);
}


function checkLocationVer(letterASC, number, x) {
   if (letterASC > 75 - x) {
       alert("Location not allowed");
       return false;
   }
   else if (number == 10 && letterASC > 65 && letterASC < 75 - x) {
       for (let i = 0; i < x + 2; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC > 65 && letterASC < 75 - x) {
       for (let i = 0; i < x + 2; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC > 65 && letterASC < 75 - x) {
       for (let i = 0; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC == 65) {
       for (let i = 1; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC == 75 - x) {
       for (let i = 0; i < x + 1; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC == 65) {
       for (let i = 1; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 1 && letterASC == 75 - x) {
       for (let i = 0; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 10 && letterASC == 65) {
       for (let i = 1; i < x + 2; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number == 10 && letterASC == 75 - x) {
       for (let i = 0; i < x + 1; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
}


function checkLocationHor(letterASC, number, x) {
  if (number > 11 - x) {
     alert("Location not allowed");
     return false;
  }
  else if (number == 11 - x && letterASC > 65 && letterASC < 74) {
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < x + 1; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number == 1 && letterASC > 65 && letterASC < 74) {
      for (let i = 0; i < 3; i++) {
          for (let j = 1; j < x + 1; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number +j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number > 1 && number < 11 - x && letterASC > 65 && letterASC < 74) {
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 +j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
  else if (number > 1 && number < 11 - x && letterASC == 65) {
      for (let i = 1; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
      else if (number > 1 && number < 11 - x && letterASC == 74) {
          for (let i = 0; i < 2; i++) {
              for (let j = 0; j < x + 2; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 1 && letterASC == 65) {
          for (let i = 1; i < 3; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 1 && letterASC == 74) {
          for (let i = 0; i < 2; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 11 - x && letterASC == 65) {
          for (let i = 1; i < 3; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number == 11 - x && letterASC == 74) {
          for (let i = 0; i < 2; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
  }



function  placeRest(place, item) {
    let letter = place.slice(0, 1);
    let number = Number(place.slice(1, 3));
    let letterASC = place.charCodeAt(0);
    console.log(letter + "" + (number + 1).toString())
    switch (item) {
        case "airCarrier":
            if (shipHorVer("ship5Pos") == "horizontal") {
                for (let i = 0; i < 4; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedCarr";
                }
            }
            else if (shipHorVer("ship5Pos") == "vertical") {
                for (let i = 1; i < 5; i++) {
                    document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedCarr";
                }
            }
            document.getElementById(place).className += " placedCarr";
            break;
        case "battleship":
            if (shipHorVer("ship4Pos") == "horizontal") {
                for (let i = 0; i < 3; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedBattle";
                }
            }
            else if (shipHorVer("ship4Pos") == "vertical") {
                for (let i = 1; i < 4; i++) {
                    document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedBattle";
                }
            }
            document.getElementById(place).className += " placedBattle";
            break;
        case "submarine":
            if (shipHorVer("ship3SubPos") == "horizontal") {
                for (let i = 0; i < 2; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedSub";
                }
            }
            else if (shipHorVer("ship3SubPos") == "vertical") {
                for (let i = 1; i < 3; i++) {
                   document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedSub";
                }
            }
            document.getElementById(place).className += " placedSub";
            break;
        case "destroyer":
            if (shipHorVer("ship3DestPos") == "horizontal") {
                for (let i = 0; i < 2; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedDest";
                }
            }
            else if (shipHorVer("ship3DestPos") == "vertical") {
                for (let i = 1; i < 3; i++) {
                    document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedDest";
                }
            }
            document.getElementById(place).className += " placedDest";
            break;
        case "patBoat":
            if (shipHorVer("ship2Pos") == "horizontal") {
            document.getElementById(place).nextSibling.className = "placed placedBoat";
            }
            else if (shipHorVer("ship2Pos") == "vertical") {
            document.getElementById(String.fromCharCode(letterASC + 1) + "" + (number).toString()).className = "placed placedBoat";
            }
            document.getElementById(place).className += " placedBoat";
            break;
    }
    let cleanCell = document.getElementById(place)
    cleanCell.removeChild(cleanCell.childNodes[0]);
 /*   document.getElementById("B5").classList.item(0);*/
}


function getShipLocation(item) {
    let arrShip = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (document.getElementById(String.fromCharCode(65 + i) + "" + (1 + j).toString()).classList.item(1) == item) {
                arrShip.push(String.fromCharCode(65 + i) + "" + (1 + j).toString());
            }
        }
    }
    return arrShip;
}

export function checkShipsPlacement() {
    if (document.getElementById("airCarrier") == null
        && document.getElementById("battleship") == null
        && document.getElementById("submarine") == null
        && document.getElementById("destroyer") == null
        && document.getElementById("patBoat") == null) {sendShips()}
    else {alert("Place all ships"); return false;}
}


function sendShips() {
    let myData = JSON.stringify([ { "type": "Destroyer", "locations": getShipLocation("placedDest") /*["A1", "B1", "C1"] */},
                   { "type": "PatrolBoat", "locations": getShipLocation("placedBoat") /*["H5", "H6"] */},
                   { "type": "AircraftCarrier", "locations": getShipLocation("placedCarr") /*["A3", "B3", "C3", "D3", "E3"] */},
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
    .then((data) => {
        console.log('Request success: ', data);
        return data.json()
    })
    .then((json) => {
        console.log(json);
        location.reload();
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    })
}


export function displayShipPlacement(item) {
    if (item.ships.length < 5) {
        document.getElementById("shipPlacement").style.visibility = 'visible';
        document.getElementById("salvoesSubmission").style.visibility = 'hidden';
        document.getElementById("gameHistory").style.visibility = 'hidden';
        document.getElementById("salvoDone").style.visibility = 'hidden';
        document.getElementById("statusMessage").innerHTML = "Place your ships"
        }
    else if (item.ships.length == 5 && item.ships[0].locations.length > 1 && item.ships[1].locations.length > 1) {
        document.getElementById("shipPlacement").style.visibility = 'hidden';
        document.getElementById("salvoesSubmission").style.visibility = 'visible';
        document.getElementById("gameHistory").style.visibility = 'visible';
    }
}


export function listenShipsGrid(item) {
    console.log("listen ships");
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).addEventListener("click", function () {removeShip(this.getAttribute("id"))});
        }
    }
}

function removeShip(idItem) {
    let myShip = document.getElementById(idItem).getAttribute("class");
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).getAttribute("class") == myShip) {
                document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).removeAttribute("class");
            }
        }
    }
    let thisShip = document.createElement("div");
    thisShip.setAttribute("draggable", "true");
    thisShip.setAttribute("ondragstart", "drag(event)");
    switch (myShip) {
        case "placed placedCarr":
            thisShip.setAttribute("id", "airCarrier");
            document.getElementById("airCarrierDiv").appendChild(thisShip);
            document.getElementById("ship5Pos").checked = false;
            break;
        case "placed placedBattle":
            thisShip.setAttribute("id", "battleship");
            document.getElementById("battleshipDiv").appendChild(thisShip);
            document.getElementById("ship4Pos").checked = false;
            break;
        case "placed placedSub":
            thisShip.setAttribute("id", "submarine");
            document.getElementById("submarineDiv").appendChild(thisShip);
            document.getElementById("ship3SubPos").checked = false;
            break;
        case "placed placedDest":
            thisShip.setAttribute("id", "destroyer");
            document.getElementById("destroyerDiv").appendChild(thisShip);
            document.getElementById("ship3DestPos").checked = false;
            break;
        case "placed placedBoat":
            thisShip.setAttribute("id", "patBoat");
            document.getElementById("patBoatDiv").appendChild(thisShip);
            document.getElementById("ship2Pos").checked = false;
            break;
    }
}
