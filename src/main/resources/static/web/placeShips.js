import { getParams } from "./game.js"


export function adjustPosition(form, ship) {
    let myShip = document.getElementById(ship);
    let widTh = window.getComputedStyle(myShip, null).getPropertyValue("width");
    let heigTh = window.getComputedStyle(myShip, null).getPropertyValue("height");
    myShip.style.width = heigTh;
    myShip.style.height = widTh;

}


export function shipHorVer(item) {
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
  if (data == "airCarrier") {
      if (shipHorVer("ship5Pos") == "horizontal") {if (checkLocationHor(letterASC, number, 5) == false) {return false}}
      else if (shipHorVer("ship5Pos") == "vertical") {if (checkLocationVer(letterASC, number, 5) == false) {return false}}
  }
  if (data == "battleship") {
      if (shipHorVer("ship4Pos") == "horizontal") {if (checkLocationHor(letterASC, number, 4) == false) {return false}}
      else if (shipHorVer("ship4Pos") == "vertical") {if (checkLocationVer(letterASC, number, 4) == false) {return false}}
  }
  if (data == "submarine") {
      if (shipHorVer("ship3SubPos") == "horizontal"){if (checkLocationHor(letterASC, number, 3) == false){return false}}
      else if (shipHorVer("ship3SubPos") == "vertical") {if (checkLocationVer(letterASC, number, 3) == false) {return false}}
  }
  if (data == "destroyer") {
      if (shipHorVer("ship3DestPos") == "horizontal") {if (checkLocationHor(letterASC, number, 3) == false){return false}}
      else if (shipHorVer("ship3DestPos") == "vertical") {if (checkLocationVer(letterASC, number, 3) == false) {return false}}
  }
  if (data == "patBoat") {
      if (shipHorVer("ship2Pos") == "horizontal") {if (checkLocationHor(letterASC, number, 2) == false) {return false}}
      else if (shipHorVer("ship2Pos") == "vertical") {if (checkLocationVer(letterASC, number, 2) == false) {return false}}
  }
  ev.target.appendChild(document.getElementById(data));
  document.getElementById(data).style.width = "35px";
  document.getElementById(start).setAttribute("class", "placed");
  console.log(data);
  console.log(start);
  placeRest(start, data);
}


export function checkLocationVer(letterASC, number, x) {

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


export function checkLocationHor(letterASC, number, x) {
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


export function  placeRest(place, item) {
    console.log("rest");
    let letter = place.slice(0, 1);
    let number = Number(place.slice(1, 3));
    let letterASC = place.charCodeAt(0);
    console.log(letter);
    console.log(number);
    console.log(letter + "" + (number + 1).toString())
    if (item == "airCarrier") {
        if (shipHorVer("ship5Pos") == "horizontal") {
            for (let i = 0; i < 4; i++) {
                //document.getElementById(letter + "" + (number + i).toString()).nextSibling.setAttribute("class", "placed");
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedCarr";
            }
            document.getElementById(place).className += " placedCarr";
        }
        else if (shipHorVer("ship5Pos") == "vertical") {
            for (let i = 1; i < 5; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedCarr";
            }
            document.getElementById(place).className += " placedCarr";
        }
    }
    else if (item == "battleship") {
        if (shipHorVer("ship4Pos") == "horizontal") {
            for (let i = 0; i < 3; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedBattle";
            }
            document.getElementById(place).className += " placedBattle";
        }
        else if (shipHorVer("ship4Pos") == "vertical") {
            for (let i = 1; i < 4; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedBattle";
            }
            document.getElementById(place).className += " placedBattle";
        }
    }
    else if (item == "submarine") {
        if (shipHorVer("ship3SubPos") == "horizontal") {
            for (let i = 0; i < 2; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedSub";
            }
            document.getElementById(place).className += " placedSub";
        }
        else if (shipHorVer("ship3SubPos") == "vertical") {
            for (let i = 1; i < 3; i++) {
               document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedSub";
            }
            document.getElementById(place).className += " placedSub";
        }
    }
    else if (item == "destroyer") {
        if (shipHorVer("ship3DestPos") == "horizontal") {
            for (let i = 0; i < 2; i++) {
                document.getElementById(letter + "" + (number + i).toString()).nextSibling.className = "placed placedDest";
            }
            document.getElementById(place).className += " placedDest";
        }
        else if (shipHorVer("ship3DestPos") == "vertical") {
            for (let i = 1; i < 3; i++) {
                document.getElementById(String.fromCharCode(letterASC + i) + "" + (number).toString()).className = "placed placedDest";
            }
            document.getElementById(place).className += " placedDest";
        }
    }
    else if (item == "patBoat") {
        if (shipHorVer("ship2Pos") == "horizontal") {
        document.getElementById(place).nextSibling.className = "placed placedBoat";
        document.getElementById(place).className += " placedBoat";
        }
        else if (shipHorVer("ship2Pos") == "vertical") {
        document.getElementById(String.fromCharCode(letterASC + 1) + "" + (number).toString()).className = "placed placedBoat";
        document.getElementById(place).className += " placedBoat";
        }
    }
    let cleanCell = document.getElementById(place)
    cleanCell.removeChild(cleanCell.childNodes[0]);

    document.getElementById("B5").classList.item(0);

}


export function getShipLocation(item) {
    let xxx = document.getElementById("B5").classList.item(0);
    console.log(xxx);
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


export function sendShips() {
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

export function removeShip(idItem) {
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
        let toggle = document.getElementById("ship5Pos");
        toggle.checked = false;
    }
    if (myShip == "placed placedBattle") {
        let container = document.getElementById("battleshipDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "battleship");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
        let toggle = document.getElementById("ship4Pos");
        toggle.checked = false;
    }
    if (myShip == "placed placedSub") {
        let container = document.getElementById("submarineDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "submarine");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
        let toggle = document.getElementById("ship3SubPos");
        toggle.checked = false;
}
    if (myShip == "placed placedDest") {
        let container = document.getElementById("destroyerDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "destroyer");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
        let toggle = document.getElementById("ship3DestPos");
        toggle.checked = false;
    }
    if (myShip == "placed placedBoat") {
        let container = document.getElementById("patBoatDiv");
        let thisShip = document.createElement("div");
        thisShip.setAttribute("id", "patBoat");
        thisShip.setAttribute("draggable", "true");
        thisShip.setAttribute("ondragstart", "drag(event)");
        container.appendChild(thisShip);
        let toggle = document.getElementById("ship2Pos");
        toggle.checked = false;
    }
}
