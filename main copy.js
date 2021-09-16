function string_to_2_digits(int) {
    return '00'.substring(0, 2 - int.toString().length) + int;
}

function Next(date_string) {
    let date_int = Date.parse(new Date(date_string));
    return new Date(date_int + 86400000);
}

function is_before(date_1, date_2) {
    return Date.parse(new Date(date_1)) < Date.parse(new Date(date_2));
}

function append_custom_row(id, ...text) {

    const header = document.createElement("div");
    header.setAttribute("class", "row");
    header.setAttribute("id", `row${id}`);
    result.appendChild(header);
    
    for (let i = 0; i < text.length; i++) {
        const cell = document.createElement("div");
        cell.setAttribute("class", `cell${i}`);
        cell.innerText = text[i];
        header.appendChild(cell);
    } 
}

function date_format(day, join_with = "") {
    let date = new Date(day);
    let y = date.getFullYear();
    let m = string_to_2_digits(date.getMonth() + 1);
    let d = string_to_2_digits(date.getDate());
    return [y, m, d].join(join_with);
}

const result = document.getElementById("result");
const e = document.querySelector("#error");
const btnGetRate = document.getElementById("btnGetRate");

btnGetRate.addEventListener("click", () => {
    let cdate = document.getElementById("cdate_from").value;
    let cdate_to = document.getElementById("cdate_to").value;

    e.innerHTML = "";
    
    if (new Date(cdate) == "Invalid Date") {
        e.innerHTML = "From date is invalid";
    }

    else if (new Date(cdate_to) == "Invalid Date") {
        e.innerHTML = "To date is invalid";
    }

    else if (!(is_before(cdate, cdate_to))) {
        e.innerHTML = "Second date can't be earlier than the first date.";
    }

    else if (is_before(Date.now(), cdate)) {
        e.innerHTML = "We don't have any data on future";
    }

    else {
        if (is_before(Date.now(), cdate_to)) {
            e.innerHTML = `${cdate_to} is in future, data until `;
            cdate_to = date_format(Date.now(), "-")
            e.innerHTML += `${cdate_to} will be displayed.`;
        }
        let rows = document.querySelectorAll(".row");
        for (let i = 0; i < rows.length; i++) {rows[i].remove();}
        append_custom_row(0, "Date", "Course");

        const currency = document.getElementById("currency").value;
        let counter = 1;
        cdate_to = date_format(Next(cdate_to), "-");
        while (cdate != cdate_to) {

            let count = counter;
            let cdate_f = cdate.split("-").join("");
            let URI = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${cdate_f}&json`;

            const XHR = new XMLHttpRequest();
            XHR.open("GET", URI, false);
            XHR.send();
            /*XHR.addEventListener("readystatechange", () => {
                if ((XHR.readyState === 4) && (XHR.status === 200)) {
                    let data = JSON.parse(XHR.responseText);
                    append_custom_row(count, data[0].exchangedate, data[0].rate)
                }
            }, false);*/
            if ((XHR.readyState === 4) && (XHR.status === 200)) {
                let data = JSON.parse(XHR.responseText);
                append_custom_row(count, data[0].exchangedate, data[0].rate)
            }

            cdate = date_format(Next(cdate), "-");
            counter += 1;
        }
    }
        
}, false);
