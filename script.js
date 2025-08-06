var xhr = new XMLHttpRequest();
xhr.open("GET", "Assets/data.json", true);
xhr.responseType = "json";
var jsonDATA = null;
xhr.onload = function () {
    if (xhr.status === 200) {
        var jsondata = xhr.response;
        console.log(jsondata);
    }
    jsonDATA = jsondata;
};

xhr.send();
const checkboxes = document.querySelectorAll('input[type="radio"]');
const primaryCheckboxes = document.querySelector(".top-middle-rad-div");
const secondaryCheckboxes = document.querySelector(".top-right-rad-div");
const tablediv = document.querySelector(".spreadsheet");

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
            primaryCheckboxes.innerHTML = "";
            secondaryCheckboxes.innerHTML = "";
            const id = ["Α", "Β", "Γ"].indexOf(event.target.value);
            checkboxes.forEach((ch) => {
                var temp_id = ["Α", "Β", "Γ"].indexOf(ch.value);
                if (temp_id != id) {
                    ch.checked = false;
                }
            });

            const jsonData1 = jsonDATA["classes"]["second"][parseInt(id)];
            const jsonData2 = jsonDATA["classes"]["third"][parseInt(id)];

            jsonData1.forEach((suboption) => {
                newRadioLabel("suboption1", suboption, false, primaryCheckboxes);
            });

            jsonData2.forEach((suboption) => {
                newRadioLabel("suboption2", suboption, false, secondaryCheckboxes);
            });
        } else {
            primaryCheckboxes.innerHTML = "";
            secondaryCheckboxes.innerHTML = "";
            checkboxes.forEach((ch) => {
                ch.checked = false;
            });
        }
        delete_spreadsheet();
    });
});

function timetable(data) {
    const teachers = jsonDATA["teachers"];
    var spreadsheet = [];
    if (String(data[0]).startsWith("Α")) {
        var _class = String(data[0]).toUpperCase();
        const tt = jsonDATA["timetable"];
        var day = [];
        for (let i = 0; i < tt.length; i++) {
            for (let j = 0; j < tt[i].length; j++) {
                if (tt[i][j].includes(_class)) {
                    day.push([teachers[j], false]);
                    var h = j;
                    break;
                } else if (j == tt[i].length - 1) {
                    day.push(["", false]);
                    var h = j;
                    break;
                }
            }
            if (day.length == 7) {
                spreadsheet.push(day);
                day = [];
            }
        }
    } else {
        var _class1 = String(data[0]).toUpperCase();
        var _class2 = String(data[1]).toUpperCase();
        const tt = jsonDATA["timetable"];
        var day = [];
        for (let i = 0; i < tt.length; i++) {
            for (let j = 0; j < tt[i].length; j++) {
                if (tt[i][j].includes(_class1)) {
                    day.push([teachers[j], false]);
                    var h = j;
                    break;
                } else if (tt[i][j].includes(_class2)) {
                    day.push([teachers[j], true]);
                    var h = j;
                    break;
                } else if (j == tt[i].length - 1) {
                    day.push(["", false]);
                    var h = j;
                    break;
                }
            }
            if (day.length == 7) {
                spreadsheet.push(day);
                day = [];
            }
        }
    }
    return spreadsheet;
}

function create_spreadsheet(data) {
    let container = tablediv;
    container.innerHTML = "<h2>Πρόγραμμα</h2>";
    let table = document.createElement("table");
    table.id = "table-id";
    var jsonData = timetable(data);

    let cols = ["", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή"];

    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item;
        if (item != "") {
            th.style.backgroundColor = "#f0f0f0";
            th.style.padding = "8px";
            th.style.borderRadius = "3px";
        }
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.append(tr);

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
                const txt = jsonData[j - 1][i][0]
                td.innerText = txt;
                if (jsonData[j - 1][i][1]) {
                    td.style.backgroundColor = "#d5ecf2";
                } else {
                    if (jsonData[j - 1][i][0].length > 0) {
                        td.style.backgroundColor = "#e8eaeb";
                    } else {
                        td.style.backgroundColor = "#d3d5d6";
                        td.innerText = "-";
                    }
                }
                td.style.cursor = 'pointer';
                td.style.padding = "10px";
                td.style.borderRadius = "3px";
                td.addEventListener('click', () => {
                    window.location.href = `/kathigites/#${txt}`;
                });
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        container.appendChild(table);
    }
    let spr = document.getElementById("spreadsheet");
    spr.style.border = "3px solid #cccccc";
    spr.style.background = "#ffffff";

    if (data[1] == null) {
        var data2 = [data[0]];
    } else {
        var data2 = data;
    }

    window.location.hash = data2.join(",");

    const tempdiv = document.querySelector(".download");
    tempdiv.innerHTML = "";

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
    if (data[1] == null) {
        data = [data[0]];
    }
    let newurl = window.location.href.split("#")[0];
    newurl += "#" + data.join(",");

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

function newClick() {
    const checkboxes = document.querySelectorAll('input[type="radio"]');
    var data = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            data.push(checkbox.value);
        }
    });
    if (data.length > 0) {
        if (data[0] == "Α" && data.length == 2) {
            create_spreadsheet([data[1], null]);
        } else if (["Β", "Γ"].includes(data[0]) && data.length == 3) {
            create_spreadsheet([data[1], data[2]]);
        } else {
            delete_spreadsheet();
        }
    } else {
        delete_spreadsheet();
    }
}

function handleCheckboxClick(event) {
    const target = event.target;
    if (target.type === "radio" && target.name != "option") {
        if (target.checked) {
            newClick();
        }
    }
}

document.body.addEventListener("click", handleCheckboxClick);

function captureElementAsImage() {
    const elementToCapture = document.getElementById("spreadsheet");
    html2canvas(elementToCapture).then(function (canvas) {
        const dataURL = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "Programma.png";

        downloadLink.click();
    });
}

function captureAndDownloadTable() {
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
    const hashString = window.location.hash.substring(1);
    const hashArr = hashString.split(",");
    var hashArray = [];
    hashArr.forEach((element) => {
        hashArray.push(decodeURIComponent(element));
    });

    if (jsonDATA != null) {
        let valid = false;
        let cl = jsonDATA["classes"];
        if (cl["second"][0].includes(hashArray[0])) {
            valid = true;
        } else if (cl["second"][1].includes(hashArray[0])) {
            if (hashArray.length == 2) {
                if (cl["third"][1].includes(hashArray[1])) {
                    valid = true;
                }
            }
        } else if (cl["second"][2].includes(hashArray[0])) {
            if (hashArray.length == 2) {
                if (cl["third"][2].includes(hashArray[1])) {
                    valid = true;
                }
            }
        }
        if (valid) {
            const radioElement = document.getElementById(hashArray[0][0]);
            radioElement.checked = true;

            primaryCheckboxes.innerHTML = "";
            secondaryCheckboxes.innerHTML = "";
            const id = ["Α", "Β", "Γ"].indexOf(hashArray[0][0]);
            checkboxes.forEach((ch) => {
                var temp_id = ["Α", "Β", "Γ"].indexOf(ch.value);
                if (temp_id != id) {
                    ch.checked = false;
                }
            });

            const jsonData1 = jsonDATA["classes"]["second"][parseInt(id)];
            const jsonData2 = jsonDATA["classes"]["third"][parseInt(id)];

            jsonData1.forEach((suboption) => {
                var checked = Boolean(hashArray[0] == suboption);
                newRadioLabel("suboption1", suboption, checked, primaryCheckboxes);
            });

            jsonData2.forEach((suboption) => {
                var checked = Boolean(hashArray[1] == suboption);
                newRadioLabel("suboption2", suboption, checked, secondaryCheckboxes);
            });
            create_spreadsheet(hashArray);
        }
    }
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
        processHash();
    } else {
        setTimeout(checkIfJSONloaded, 100);
    }
}

checkIfJSONloaded();
window.addEventListener("hashchange", checkIfJSONloaded);
