const cardA = document.getElementById("card-a");
const textA = document.getElementById("text-a");

const cardB = document.getElementById("card-b");
const textB = document.getElementById("text-b");

const cardC = document.getElementById("card-c");
const textC = document.getElementById("text-c");

const cardD = document.getElementById("card-d");
const textD = document.getElementById("text-d");

class ParkingLot {
    constructor(available,timestamp_in,timestamp_out,name) {
        this.name           = name;
        this.available      = available;
        this.timestamp_in   = timestamp_in;
        this.timestamp_out  = timestamp_out;
    }
}


let A = new ParkingLot(true,0,0,"A");
let B = new ParkingLot(true,0,0,"B");
let C = new ParkingLot(true,0,0,"C");
let D = new ParkingLot(true,0,0,"D");

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


function CheckInParkingLot(info) {
    if (info["parking_lot_name"] == "A") {
        A.timestamp_in  = info['timestamp'];
        A.available     = false;
    }
    else if (info["parking_lot_name"] == "B") {
        B.timestamp_in  = info['timestamp'];
        B.available     = false;
    }
    else if (info["parking_lot_name"] == "C") {
        C.timestamp_in  = info['timestamp'];
        C.available     = false;
    }
    else if (info["parking_lot_name"] == "D") {
        D.timestamp_in  = info['timestamp'];
        D.available     = false;
    }
}

function CheckOutParkingLot(info) {
    if (info["parking_lot_name"] == "A") {
        A.timestamp_out  = info['timestamp'];
        A.available      = true;
        updateLastCheckOut(A);
    }
    else if (info["parking_lot_name"] == "B") {
        B.timestamp_out  = info['timestamp'];
        B.available      = true;
        updateLastCheckOut(B);
    }
    else if (info["parking_lot_name"] == "C") {
        C.timestamp_out  = info['timestamp'];
        C.available      = true;
        updateLastCheckOut(C);
    }
    else if (info["parking_lot_name"] == "D") {
        D.timestamp_out  = info['timestamp'];
        D.available      = true;
        updateLastCheckOut(D);
    } 
}

function updateLastCheckOut(P) {
    const parkingLotElement     = document.getElementById("p-name");
    const timeInElement         = document.getElementById("time-in");
    const timeOutelement        = document.getElementById("time-out");
    const costElement           = document.getElementById("cost");
    const boxElement            = document.getElementById("lc-main-box");

    var timeIn = new Date(P.timestamp_in);
    var timeOut = new Date(P.timestamp_out);
    var timePark = timeOut - timeIn;
    var timeParkMinute = Math.ceil(timePark/1000/60);
    var timeInStr = timeIn.toLocaleString("en-US", {timeZoneName: "short"})
    var timeOutStr = timeOut.toLocaleString("en-US", {timeZoneName: "short"})


    parkingLotElement.innerHTML = `Parking Lot ${P.name}`;
    timeInElement.innerHTML     = `${timeInStr}`;
    timeOutelement.innerHTML    = `${timeOutStr}`;
    costElement.innerHTML       = `${timeParkMinute*20} XCoin`;
    boxElement.style.backgroundColor = 'rgb(255, 226, 112)';
    setTimeout(()=> {
        boxElement.style.backgroundColor = 'white';
    } ,500)

    P.timestamp_in = 0;
    P.timestamp_out = 0;


}

function updateUI_LOCAL(info) {
    if (info["parking_available"]) {
        checkIn(info["parking_lot_name"], info["timestamp"]);
        CheckInParkingLot(info);
    } else {
        checkOut(info["parking_lot_name"]);
        CheckOutParkingLot(info);
    }
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
// LOCAL
let first_info = {
    "_id": "602748f4f56e3c00070ec8af",
    "parking_lot_name": "A",
    "parking_available": true,
    "timestamp": 1613187625
};

let second_info = {
    "_id": "602748f4f56e3c00070ec8af",
    "parking_lot_name": "B",
    "parking_available": true,
    "timestamp": 1613197625
};
let third_info = {
    "_id": "602748f4f56e3c00070ec8af",
    "parking_lot_name": "B",
    "parking_available": false,
    "timestamp": 1623197625
};
let fourth_info = {
    "_id": "602748f4f56e3c00070ec8af",
    "parking_lot_name": "A",
    "parking_available": false,
    "timestamp": 1613197625
};
function sender1() {
    updateUI_LOCAL(second_info);
}
function sender2() {
    updateUI_LOCAL(third_info);
}
function sender3() {
    updateUI_LOCAL(fourth_info);
}
//




// ใช้ไอ้นี้ สำหลับทุก json record
updateUI_LOCAL(first_info);
var a = setTimeout(sender1 , 3000);
var a = setTimeout(sender2 , 6000);
var a = setTimeout(sender3 , 9000);








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

