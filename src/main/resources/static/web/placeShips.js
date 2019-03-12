import { getParams } from "./game.js"


export function adjustPosition(form, ship) {
    const myShip = document.getElementById(ship);
    const widTh = window.getComputedStyle(myShip, null).getPropertyValue("width");
    const heigTh = window.getComputedStyle(myShip, null).getPropertyValue("height");
    myShip.style.width = heigTh;
    myShip.style.height = widTh;
}

function shipHorVer(item) {
    const check = document.getElementById(item).checked;
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
  const data = ev.dataTransfer.getData("text");
  const start = ev.target.getAttribute("id");
  //console.log(start);
  //console.log(shipHorVer("ship5"));
  const letterASC = start.charCodeAt(0);
  //console.log(letterASC);
  const number = Number(start.slice(1, 3));
  switch (data) {
      case "airCarrier":
          if (shipHorVer("airCarrierBox") === "horizontal" && checkLocationHor(letterASC, number, 5) === false) {return false};
          if (shipHorVer("airCarrierBox") === "vertical" && checkLocationVer(letterASC, number, 5) === false) {return false};
          break;
      case "battleship":
          if (shipHorVer("battleshipBox") === "horizontal" && checkLocationHor(letterASC, number, 4) === false) {return false};
          if (shipHorVer("battleshipBox") === "vertical" && checkLocationVer(letterASC, number, 4) === false) {return false};
          break;
      case "submarine":
          if (shipHorVer("submarineBox") === "horizontal" && checkLocationHor(letterASC, number, 3) === false){return false};
          if (shipHorVer("submarineBox") === "vertical" && checkLocationVer(letterASC, number, 3) === false) {return false};
          break;
      case "destroyer":
          if (shipHorVer("destroyerBox") === "horizontal" && checkLocationHor(letterASC, number, 3) === false){return false};
          if (shipHorVer("destroyerBox") === "vertical" && checkLocationVer(letterASC, number, 3) === false) {return false};
          break;
      case "patBoat":
          if (shipHorVer("patBoatBox") === "horizontal" && checkLocationHor(letterASC, number, 2) === false) {return false};
          if (shipHorVer("patBoatBox") === "vertical" && checkLocationVer(letterASC, number, 2) === false) {return false};
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
   else if (number === 10 && letterASC > 65 && letterASC < 75 - x) {
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
   else if (number > 1 && number < 10 && letterASC === 65) {
       for (let i = 1; i < x + 2; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number > 1 && number < 10 && letterASC === 75 - x) {
       for (let i = 0; i < x + 1; i++) {
           for (let j = 0; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number === 1 && letterASC === 65) {
       for (let i = 1; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number === 1 && letterASC === 75 - x) {
       for (let i = 0; i < x + 1; i++) {
           for (let j = 1; j < 3; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number === 10 && letterASC === 65) {
       for (let i = 1; i < x + 2; i++) {
           for (let j = 0; j < 2; j++) {
               if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                   alert("Location not allowed");
                   return false;
               }
           }
       }
   }
   else if (number === 10 && letterASC === 75 - x) {
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
  else if (number === 11 - x && letterASC > 65 && letterASC < 74) {
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
          for (let j = 0; j < x + 1; j++) {
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
  else if (number > 1 && number < 11 - x && letterASC === 65) {
      for (let i = 1; i < 3; i++) {
          for (let j = 0; j < x + 2; j++) {
              if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                  alert("Location not allowed");
                  return false;
              }
          }
      }
  }
      else if (number > 1 && number < 11 - x && letterASC === 74) {
          for (let i = 0; i < 2; i++) {
              for (let j = 0; j < x + 2; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number === 1 && letterASC === 65) {
          for (let i = 1; i < 3; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number === 1 && letterASC === 74) {
          for (let i = 0; i < 2; i++) {
              for (let j = 1; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number === 11 - x && letterASC === 65) {
          for (let i = 1; i < 3; i++) {
              for (let j = 0; j < x + 1; j++) {
                  if (document.getElementById(String.fromCharCode(letterASC - 1 + i) + "" + (number - 1 + j).toString()).classList.item(0) == "placed") {
                      alert("Location not allowed");
                      return false;
                  }
              }
          }
      }
      else if (number === 11 - x && letterASC === 74) {
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
    const letter = place.slice(0, 1);
    const number = Number(place.slice(1, 3));
    const letterASC = place.charCodeAt(0);
    console.log(letter + "" + (number + 1).toString())
    switch (item) {
        case "airCarrier":
            if (shipHorVer("airCarrierBox") === "horizontal") {
                for (let i = 0; i < 4; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedCarr";
                }
            }
            else if (shipHorVer("airCarrierBox") === "vertical") {
                for (let i = 1; i < 5; i++) {
                    document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedCarr";
                }
            }
            document.getElementById(place).className += " placedCarr";
            break;
        case "battleship":
            if (shipHorVer("battleshipBox") === "horizontal") {
                for (let i = 0; i < 3; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedBattle";
                }
            }
            else if (shipHorVer("battleshipBox") === "vertical") {
                for (let i = 1; i < 4; i++) {
                    document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedBattle";
                }
            }
            document.getElementById(place).className += " placedBattle";
            break;
        case "submarine":
            if (shipHorVer("submarineBox") === "horizontal") {
                for (let i = 0; i < 2; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedSub";
                }
            }
            else if (shipHorVer("submarineBox") === "vertical") {
                for (let i = 1; i < 3; i++) {
                   document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedSub";
                }
            }
            document.getElementById(place).className += " placedSub";
            break;
        case "destroyer":
            if (shipHorVer("destroyerBox") === "horizontal") {
                for (let i = 0; i < 2; i++) {
                    document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedDest";
                }
            }
            else if (shipHorVer("destroyerBox") === "vertical") {
                for (let i = 1; i < 3; i++) {
                    document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedDest";
                }
            }
            document.getElementById(place).className += " placedDest";
            break;
        case "patBoat":
            if (shipHorVer("patBoatBox") === "horizontal") {
            document.getElementById(place).nextSibling.className = "placed placedBoat";
            }
            else if (shipHorVer("patBoatBox") === "vertical") {
            document.getElementById(String.fromCharCode(letterASC + 1) + "" + (number).toString()).className = "placed placedBoat";
            }
            document.getElementById(place).className += " placedBoat";
            break;
    }
    const cleanCell = document.getElementById(place)
    cleanCell.removeChild(cleanCell.childNodes[0]);
}


function getShipLocation(item) {
    const arrShip = [];
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
    const myData = JSON.stringify([ { "type": "Destroyer", "locations": getShipLocation("placedDest") /*["A1", "B1", "C1"] */},
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
        }
    else if (item.ships.length === 5 && item.ships[0].locations.length > 1 && item.ships[1].locations.length > 1) {
        document.getElementById("shipPlacement").style.visibility = 'hidden';
    }
}


export function listenShipsGrid(item) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).addEventListener("click", function () {removeShip(this.getAttribute("id"))});
        }
    }
}

function removeShip(idItem) {
    const myShip = document.getElementById(idItem).getAttribute("class");
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).getAttribute("class") === myShip) {
                document.getElementById(String.fromCharCode(65 + i) + "" + (j + 1)).removeAttribute("class");
            }
        }
    }
    const shipClass = ["placed placedCarr", "placed placedBattle", "placed placedSub", "placed placedDest", "placed placedBoat"];
    const shipIds = ["airCarrier", "battleship", "submarine", "destroyer", "patBoat"];
    const thisShip = document.createElement("div");
    thisShip.setAttribute("draggable", "true");
    thisShip.setAttribute("ondragstart", "drag(event)");
    for (let i = 0; i < shipClass.length; i++) {
        if (myShip === shipClass[i]) {
            thisShip.setAttribute("id", shipIds[i]);
            document.getElementById( shipIds[i] + "Div").appendChild(thisShip);
            document.getElementById(shipIds[i] + "Box").checked = false;
        }
    }
}
