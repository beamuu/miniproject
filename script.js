const cardA = document.getElementById("card-a");
const textA = document.getElementById("text-a");

const cardB = document.getElementById("card-b");
const textB = document.getElementById("text-b");

const cardC = document.getElementById("card-c");
const textC = document.getElementById("text-c");

const cardD = document.getElementById("card-d");
const textD = document.getElementById("text-d");

// time out, cost
var A_HIST = {};
var B_HIST = {};
var C_HIST = {};
var D_HIST = {};

function addHistory(dict, key, value) {
    dict[key] = value;
}

function selectDict(where) {
    switch (where) {
        case "A":
            return A_HIST;
        case "B":
            return B_HIST;
        case "C":
            return C_HIST;
        case "D":
            return D_HIST;
    }
}

class ParkingLot {
    constructor(available, timestamp_in, timestamp_out, name) {
        this.name = name;
        this.available = available;
        this.timestamp_in = timestamp_in;
        this.timestamp_out = timestamp_out;
    }
}

let A = new ParkingLot(true, 0, 0, "A");
let B = new ParkingLot(true, 0, 0, "B");
let C = new ParkingLot(true, 0, 0, "C");
let D = new ParkingLot(true, 0, 0, "D");

function selectParking(where) {
    switch (where) {
        case "A":
            return [A, cardA, textA];
        case "B":
            return [B, cardB, textB];
        case "C":
            return [C, cardC, textC];
        case "D":
            return [D, cardD, textD];
    }
}

function checkIn(where, timestamp) {
    let [parkinglot, card, text] = selectParking(where);
    parkinglot.timestamp_in = timestamp;
    parkinglot.available = false;
    card.style.backgroundColor = "#ff5757";

    let now = new Date().getTime();
    var distance = now - timestamp;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    text.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}

function checkOut(where, timestamp) {
    let [parkinglot, card, text] = selectParking(where);
    parkinglot.timestamp_out = timestamp;
    parkinglot.available = true;
    updateLastCheckOut(parkinglot);
    card.style.backgroundColor = "#7fd955";
    text.innerHTML = "Available";
}

function updateLastCheckOut(P) {
    const parkingLotElement = document.getElementById("p-name");
    const timeInElement = document.getElementById("time-in");
    const timeOutelement = document.getElementById("time-out");
    const costElement = document.getElementById("cost");
    const boxElement = document.getElementById("lc-main-box");

    var timeIn = new Date(P.timestamp_in);
    var timeOut = new Date(P.timestamp_out);
    var timePark = timeOut - timeIn;
    var timeParkMinute = Math.ceil(timePark / 1000 / 60);
    var timeInStr = timeIn.toLocaleString("en-US", { timeZoneName: "short" })
    var timeOutStr = timeOut.toLocaleString("en-US", { timeZoneName: "short" })

    parkingLotElement.innerHTML = `Parking Lot ${P.name}`;
    timeInElement.innerHTML = `${timeInStr}`;
    timeOutelement.innerHTML = `${timeOutStr}`;
    costElement.innerHTML = `${timeParkMinute * 20} XCoin`;
    boxElement.style.backgroundColor = 'rgb(255, 226, 112)';
    setTimeout(() => {
        boxElement.style.backgroundColor = 'white';
    }, 500)

    addHistory(selectDict(P.name), P.timestamp_out, timeParkMinute * 20);

    P.timestamp_in = 0;
    P.timestamp_out = 0;
}

function update(info) {
    if (info.parking_available) {
        checkIn(info.parking_lot_name, info.timestamp*1000);
    } else {
        checkOut(info.parking_lot_name, info.timestamp*1000);
    }
}

function clearData() {
    A = new ParkingLot(true, 0, 0, "A");
    B = new ParkingLot(true, 0, 0, "B");
    C = new ParkingLot(true, 0, 0, "C");
    D = new ParkingLot(true, 0, 0, "D");
    A_HIST = {};
    B_HIST = {};
    C_HIST = {};
    D_HIST = {};
}

function loadData() {
    var url = "http://158.108.182.6:3000/find_all";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                clearData();
                update(data);
                // console.log(data);
            })
        );
}

loadData();
setInterval(() => {
    loadData();
}, 1000);


window.onload = function () {
    //Plot01
    var dps01 = []; // dataPoints
    var chart01 = new CanvasJS.Chart("chartContainer01",
        {
            title:
            {
                text: "A"
            },
            data: [{ type: "line", dataPoints: dps01 }]
        });
    //init val
    var yVal01 = 0;
    var updateInterval01 = 1000;
    var dataLength01 = 20; // number of dataPoints visible at any point
    var updateChart01 = function (count) {
        for (var key in A_HIST) {
            yVal01 = yVal01 + A_HIST[key];
            dps01.push({ x: key, y: yVal01 });
            delete A_HIST[key];
        }
        if (dps01.length > dataLength01) dps01.shift();
        chart01.render();
    };

    //Plot02
    var dps02 = []; // dataPoints
    var chart02 = new CanvasJS.Chart("chartContainer02",
        {
            title:
            {
                text: "B"
            },
            data: [{ type: "line", dataPoints: dps02 }]
        });
    //init val
    var yVal02 = 0;
    var updateInterval02 = 1000;
    var dataLength02 = 20; // number of dataPoints visible at any point
    var updateChart02 = function (count) {
        for (var key in B_HIST) {
            yVal02 = yVal02 + B_HIST[key];
            dps02.push({ x: key, y: yVal02 });
            delete B_HIST[key];
        }
        if (dps02.length > dataLength02) dps02.shift();
        chart02.render();
    };

    //Plot03
    var dps03 = []; // dataPoints
    var chart03 = new CanvasJS.Chart("chartContainer03",
        {
            title:
            {
                text: "C"
            },
            data: [{ type: "line", dataPoints: dps03 }]
        });
    //init val
    var yVal03 = 0;
    var updateInterval03 = 1000;
    var dataLength03 = 20; // number of dataPoints visible at any point
    var updateChart03 = function (count) {
        for (var key in C_HIST) {
            yVal03 = yVal03 + C_HIST[key];
            dps03.push({ x: key, y: yVal03 });
            delete C_HIST[key]
        }
        if (dps03.length > dataLength03) dps03.shift();
        chart03.render();
    };


    //Plot04
    var dps04 = []; // dataPoints
    var chart04 = new CanvasJS.Chart("chartContainer04",
        {
            title:
            {
                text: "D"
            },
            data: [{ type: "line", dataPoints: dps04 }]
        });
    //init val
    var yVal04 = 0;
    var updateInterval04 = 1000;
    var dataLength04 = 20; // number of dataPoints visible at any point
    var updateChart04 = function (count) {
        for (var key in D_HIST) {
            yVal04 = yVal04 + D_HIST[key];
            dps04.push({ x: key, y: yVal04 });
            delete D_HIST[key]
        }
        if (dps04.length > dataLength04) dps04.shift();
        chart04.render();
    };


    updateChart01(dataLength01);
    setInterval(function () { updateChart01() }, updateInterval01);

    updateChart02(dataLength02);
    setInterval(function () { updateChart02() }, updateInterval02);

    updateChart03(dataLength03);
    setInterval(function () { updateChart03() }, updateInterval03);

    updateChart04(dataLength04);
    setInterval(function () { updateChart04() }, updateInterval04);
}