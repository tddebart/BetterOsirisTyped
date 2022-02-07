import React from "react";
import ReactDOM from "react-dom";
import "./css/app.css";
//https://davinci.osiris-student.nl/#/rooster
const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"]
const hours : Array<string> = []
for (let i = 9; i < 18; i++) {
    hours.push(i + ":00")
    hours.push(i + ":30")
}

// document.body.style.border = "5px solid red";
console.log("BetterOsiris loaded")
setTimeout(function () {
    let calendarParent = document.getElementsByTagName("page-calendar");
    if(calendarParent.length == 0) return;

    changed()

}, 1000)

window.onclick = function () {
    changed()
};

function changed () {
    let calendarList = document.getElementsByTagName("page-calendar");
    if(calendarList.length == 0 || document.getElementsByClassName("dayElement").length != 0) return;
    const calendar = calendarList[0];
    if(calendar == null) return;
    // @ts-ignore
    var dates = calendar.textContent.split("\n").map((i :string) => i.trim()).filter(function(entry : string) {
        return (entry.trim() != '' && entry != "expand_less");
    })
    dates.splice(0, 20)
    dates.pop()
    let render : any[] = []
    // for (let i = 0; i < dates.length; i++) {
    //     let date = dates[i];
    //     let iExtra = 0;
    //     if(days.some(p => date.indexOf(p) > -1)) {
    //         // console.log("found day: " + date);
    //         // let dayElement = document.createElement("div");
    //         // dayElement.className = "dayElement";
    //         // dayElement.innerHTML = date;
    //         // calendar.getElementsByClassName("fill-width fill-height")[0].appendChild(dayElement);
    //         calendar.getElementsByClassName("fill-width fill-height")[0].className = "fill-width fill-height dayGrid";
    //
    //         iExtra++;
    //         while(dates[i + iExtra] != null && days.every(p => dates[i+iExtra].indexOf(p) == -1)) {
    //             // var dateElement = document.createElement("div");
    //             // dateElement.className = "date";
    //             // dateElement.innerHTML = dates[i + iExtra];
    //             // dayElement.appendChild(dateElement);
    //             iExtra++;
    //         }
    //         console.log("found day: " + dates[i]);
    //         render.push(<DateElement dates={dates.slice(i, i+iExtra) }/>);
    //         i += iExtra-1;
    //     }
    // }
    render.push(<Calendar/>);
    ReactDOM.render(render, calendar.getElementsByClassName("fill-width fill-height")[0]);
}

const Calendar = () => {
    return (
        <>
            <div style={{display: "flex"}}>
                {days.map(day => <div key={"top"+day} className="topCalendar">{day}</div>)}
            </div>
            <div style={{display: "flex", height: "100%"}}>
                {days.map(day => <div key={"bottom"+day} className="bottomCalendar">{
                    hours.map(hour =>
                    <div className="hour" key={day+hour}>
                        <div key={day+hour+"text"} className="hourText">{hour}</div>
                        <div key={day+hour+"display"} className="hourDisplay"/>
                    </div>)
                }</div>)}
            </div>
        </>
    )
}

const DateElement = (props : {dates : string[]}) => {
    return (
        <div className="dayElement">
            {props.dates.map((date : string) =>
                <div>{date}</div>
            )}
        </div>
    )
}