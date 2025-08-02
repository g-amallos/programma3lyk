var xhr = new XMLHttpRequest();
xhr.open("GET", "../Assets/data.json", true);
xhr.responseType = "json";
var jsonDATA = null;
xhr.onload = function () {
    if (xhr.status === 200) {
        var jsondata = xhr.response;
        console.log(jsondata);
    } else {
        console.log("XMLHttpRequest caught error: ", xhr.status);
    }
    jsonDATA = jsondata;
};

xhr.send();

const radioDiv = document.querySelector(".top-div");
const tablediv = document.querySelector(".spreadsheet");

function setupRadios() {
    const teachers = jsonDATA["teachers"];
    radioDiv.innerHTML = "";
    for (let i = 0; i < teachers.length; i++) {
        newRadioLabel(teachers[i], teachers[i], false, radioDiv);
    }
}

function timetable(data) {
    const teachers = jsonDATA["teachers"];
    if (teachers.includes(data)) {
        const idx = teachers.indexOf(data);
        var spreadsheet = [];
        for (let i = 0; i < 5; i++) {
            var day = [];
            for (let j = 0; j < 7; j++) {
                var s = jsonDATA["timetable"][i*7+j][idx];
                if (s.length>0) {
                    day.push(s);
                } else {
                    day.push(null);
                }
            }
            spreadsheet.push(day);
        }
        //console.log(spreadsheet);
        return spreadsheet;
    }
    return null
}

function create_spreadsheet(data) {
    let container = tablediv;
    container.innerHTML = '<h2 class="spreadsheet-title">Πρόγραμμα Καθηγητή</h2><h5>('+data+")</h5>";
    let table = document.createElement("table");
    table.id = "table-id";
    var jsonData = timetable(data);

    // Get the keys (column names) of the first object in the JSON data
    let cols = ["", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή"];

    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    // Loop through the column names and create header cells
    cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item; // Set the column name as the text of the header cell
        if (item != "") {
            th.style.backgroundColor = "#f0f0f0";
            th.style.padding = "8px";
            th.style.borderRadius = "3px";
        }
        tr.appendChild(th); // Append the header cell to the header row
    });
    thead.appendChild(tr); // Append the header row to the header
    table.append(tr); // Append the header to the table

    // Loop through the JSON data and create table rows
    for (let i = 0; i < 7; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 6; j++) {
            if (j == 0) {
                let td = document.createElement("td");
                td.innerText = String(i + 1);
                td.style.backgroundColor = "#f0f0f0";
                td.style.padding = "10px";
                td.style.borderRadius = "3px";
                tr.appendChild(td);
            } else {
                let td = document.createElement("td");
                if (jsonData[j - 1][i] !== null) {
                    td.style.backgroundColor = "#e8eaeb";
                    td.innerText = jsonData[j - 1][i].join(", ");
                } else {
                    td.style.backgroundColor = "#d3d5d6";
                    td.innerText = "-";
                }
                td.style.padding = "10px";
                td.style.borderRadius = "3px";
                tr.appendChild(td);
            }
            table.appendChild(tr); // Append the table row to the table
        }
        container.appendChild(table); // Append the table to the container element
    }
    let spr = document.getElementById("spreadsheet");
    spr.style.border = "3px solid #cccccc";
    spr.style.background = "#ffffff";

    window.location.hash = data;

    const tempdiv = document.querySelector(".download");
    tempdiv.innerHTML = "";
    // Create a button element
    const button1 = document.createElement("button");
    button1.textContent = "Κατέβασε το πρόγραμμα";
    button1.id = "downloadButton";
    button1.onclick = captureAndDownloadTable;
    tempdiv.appendChild(button1);

    const button2 = document.createElement("button");
    button2.textContent = "Αντιγραφή συνδέσμου";
    button2.id = "copyLink";
    button2.addEventListener("click", function () {
        copyLink(data);
    });
    tempdiv.appendChild(button2);
}

function copyLink(data) {
    let newurl = window.location.href.split("#")[0];
    newurl += "#" + data;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(newurl);
    } else {
        console.log("Can't copy the URL");
    }
}

function delete_spreadsheet() {
    document.getElementById("spreadsheet").style.border = "none";
    tablediv.innerHTML = "";
    let tempdiv = document.querySelector(".download");
    tempdiv.innerHTML = "";
}

function handleCheckboxClick(event) {
    const target = event.target;
    if (target.type === "radio" && target.name != "option") {
        if (target.checked) {
            radioClick(target);
        }
    }
}

document.body.addEventListener("click", handleCheckboxClick);

function captureElementAsImage() {
    const elementToCapture = document.getElementById("spreadsheet");

    // Use html2canvas to capture the element as an image
    html2canvas(elementToCapture).then(function (canvas) {
        // Convert the canvas to a data URL (PNG format)
        const dataURL = canvas.toDataURL("image/png");

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "Programma.png";

        downloadLink.click();
    });
}

function captureAndDownloadTable() {
    // Create a canvas with double-resolution.
    const element = document.getElementById("spreadsheet");
    html2canvas(element, {
        scale: 3,
        onrendered: function (canvas) {
            const dataURL = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = dataURL;
            downloadLink.download = "Programma.png";
            downloadLink.click();
        },
    });
}

function processHash() {
    const hashString = decodeURIComponent(window.location.hash.substring(1));
    if (jsonDATA != null) {
        let valid = false;
        let cl = jsonDATA["teachers"];
        if (cl.includes(hashString)) {
            valid = true;
        }
        if (valid) {
            const radioElement = document.getElementById(hashString);
            radioElement.checked = true;
            create_spreadsheet(hashString);
        }
    }
}

function radioClick(e) {
    const teachers = jsonDATA["teachers"];
    for (let i = 0; i < teachers.length; i++) {
        var temp = document.getElementById(teachers[i]);
        if (temp.id == e.id) {
            e.checked = true;
        } else {
            temp.checked = false;
        }
    }
    create_spreadsheet(e.id);
}

function newRadioLabel(name, id, checked, div) {
    const label = document.createElement("label");
    label.setAttribute("for", id);
    const input = document.createElement("input");
    input.type = "radio";
    input.id = id;
    input.name = name;
    input.value = id;
    input.checked = checked;

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + String(id)));

    div.appendChild(label);
    div.appendChild(document.createElement("br"));
}

function checkIfJSONloaded() {
    if (jsonDATA != null) {
        setupRadios();
        processHash();
    } else {
        setTimeout(checkIfJSONloaded, 100);
    }
}

checkIfJSONloaded();
window.addEventListener("hashchange", checkIfJSONloaded);
