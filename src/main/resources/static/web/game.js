loadData()
function loadData() {
let url = " http://localhost:8080/api/game_view/1";
    fetch(url).then((response) => {
        return response.json()
    })
    .then((json) => {
        console.log(json);
        var myGame = json;
        console.log(myGame);
        showGame(myGame);
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
                //column.innerHTML = "c";
                row.appendChild(column);
            }
        }
}