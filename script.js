const cardA = document.getElementById("card-a");
const textA = document.getElementById("text-a");

const cardB = document.getElementById("card-b");
const textB = document.getElementById("text-b");

const cardC = document.getElementById("card-c");
const textC = document.getElementById("text-c");

const cardD = document.getElementById("card-d");
const textD = document.getElementById("text-d");

function selectParking(where) {
    switch (where) {
        case "A":
            return [cardA, textA];
        case "B":
            return [cardB, textB];
        case "C":
            return [cardC, textC];
        case "D":
            return [cardD, textD];
    }
}

function checkIn(where, timstamp) {
    let [card, text] = selectParking(where);
    card.style.backgroundColor = "#ff5757";

    let now = new Date().getTime();
    var distance = now - timstamp;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    text.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}

function checkOut(where) {
    let [card, text] = selectParking(where);
    card.style.backgroundColor = "#7fd955";
    text.innerHTML = "Available";
}

// for dict?
// function updateUI(info) {
//     if (info["parking_available"]) {
//         checkIn(info["parking_lot_name"], info["timstamp"]);
//     } else {
//         checkOut(info["parking_lot_name"]);
//     }
// }

// for response.json()
function updateUI(info) {
    if (info.parking_available) {
        checkIn(info.parking_lot_name, info.timstamp);
    } else {
        checkOut(info.parking_lot_name);
    }
}

// setInterval(() => {
//     updateUI();
// }, 1000);

// let first_info = {
//     "_id": "602748f4f56e3c00070ec8af",
//     "parking_lot_name": "A",
//     "parking_available": false,
//     "timstamp": 1613187625
// };
// let second_info = {
//     "_id": "602748f4f56e3c00070ec8af",
//     "parking_lot_name": "B",
//     "parking_available": true,
//     "timstamp": 1613187625
// };
// ใช้ไอ้นี้ สำหลับทุก json record
// updateUI(first_info);
// updateUI(second_info);


function loadData() {
    var url = "http://158.108.182.0:4321/app/exceed_backend/exceed_backend/g5/view1";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.forEach((data) => {
                updateUI(data);
                console.log(data);
            })
        );
}

loadData();