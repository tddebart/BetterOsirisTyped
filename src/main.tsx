import React from "react";
import ReactDOM from "react-dom";
import "./css/app.css";
//https://davinci.osiris-student.nl/#/rooster
const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"]
const hours : Array<string> = []
for (let i = 9; i < 18; i++) {
    if(i == 9) {
        hours.push(`0${i}:00`)
        hours.push(`0${i}:30`)
    } else {
        hours.push(i + ":00")
        hours.push(i + ":30")
    }
}

// document.body.style.border = "5px solid red";
console.log("BetterOsiris loaded")
setTimeout(function () {
    let calendarParent = document.getElementsByTagName("page-calendar");
    if(calendarParent.length == 0) return;

    changed()

}, 1000)

setInterval(function () {
    UpdateTimeBar();
}, 10000)

setTimeout(function () {
    changed()
}, 3000)

window.onclick = function () {
    // changed()
    setTimeout(function () {changed()}, 100)
};

function changed () {
    console.log("changed called")
    let calendarList = document.getElementsByTagName("page-calendar");
    if(calendarList.length == 0 || document.getElementsByClassName("dayElement").length != 0) return;
    const calendar = calendarList[0];
    if(calendar == null) return;

    clearPrevious(calendar);

    var clickableDays = document.getElementsByTagName("osi-calendar-day");
    for (let i = 0; i < clickableDays.length; i++) {
        const clickableDay = clickableDays[i];
        if(clickableDay.children.length == 0) continue;
        if(clickableDay.children[0].children.length == 1) {
            var clickObject = clickableDay.children[0].children[0] as HTMLElement;
            if(clickableDay.getElementsByClassName("disabled").length == 0) {
                clickObject.click();
            }
        }
    }

    // @ts-ignore
    var dates = calendar.textContent.split("\n").map((i :string) => i.trim()).filter(function(entry : string) {
        return (entry.trim() != '' && entry != "expand_less");
    })
    dates.splice(0, 20)
    dates.pop()
    ReactDOM.render(<Calendar/>, calendar.getElementsByClassName("fill-width fill-height")[0]);
    let parent = calendar.getElementsByClassName("rightHours")[0]
    UpdateTimeBar();

    var dayIndex = 0;
    for (let i = 0; i < dates.length; i++) {
        let date = dates[i];
        let iExtra = 0;
        if(days.some(p => date.indexOf(p) > -1)) {
            iExtra++;
            while(dates[i + iExtra] != null && days.every(p => dates[i+iExtra].indexOf(p) == -1)) {
                iExtra++;
            }

            console.log("found day: " + dates[i]);
            for (let j = i; j < i+iExtra-1; j+=5) {
                const startTime = dates[j+1]
                if(isNaN(parseInt(startTime.slice(0,2)))) {
                    return;
                }
                const endTime = dates[j+2]
                const name = dates[j+3]
                const docent = dates[j+4]
                const room = dates[j+5]

                // if(i == 0) {
                    var d1 = new Date();
                    d1.setHours(parseInt(startTime.slice(0,2)));
                    var mins1 = isNaN(parseInt(startTime.slice(2,5))) ? parseInt(startTime.slice(3,5)) : parseInt(startTime.slice(2,5));
                    d1.setMinutes(mins1);
                    var d2 = new Date();
                    d2.setHours(parseInt(endTime.slice(0,2)));
                    var mins2 = isNaN(parseInt(endTime.slice(2,5))) ? parseInt(endTime.slice(3,5)) : parseInt(endTime.slice(2,5));
                    d2.setMinutes(mins2);
                    var diffHour = d2.getHours() - d1.getHours();
                    var diffMin = d2.getMinutes() - d1.getMinutes();
                    var part = document.createElement("div")
                    part.className = "part"
                    part.style.top =  d1.getMinutes()*2.5 + "px";
                    part.style.height = (diffHour * 75*2) + (diffMin * 2.5) + "px"
                    part.innerText = name + "\n" + docent + "\n" + room


                    parent.children[dayIndex].children[(d1.getHours()-9)*2+1].appendChild(part)

                // }
            }
            dayIndex++;
            i += iExtra-1;
        }
    }
}

const Calendar = () => {
    return (
        <>
            <div style={{display:"flex"}}>
                <div style={{width: "35px"}}/>
                <div style={{display: "flex"}}>
                    {days.map(day => <div key={"top"+day} className="topCalendar">{day}</div>)}
                </div>
            </div>
            <div style={{height: "100%", overflow: "scroll", display: "flex"}}>
                <div className="leftHours">
                    {
                        hours.map(hour =>
                        <div className="hour" key={hour}>
                            <div key={hour+"text"} className="hourText">{hour}</div>
                        </div>)
                    }
                </div>
                <div className="rightHours">
                    {
                        days.map(() =>
                            <div className={"dayContainer"}>
                                {
                                    hours.map(() =>
                                        <div className="hourContainer"/>
                                    )
                                }
                            </div>
                        )
                    }
                    <div className="timeBar"></div>
                </div>
            </div>
        </>
    )
}

function UpdateTimeBar() {
    // update time bar
    let timeBar = document.getElementsByClassName("timeBar")[0] as HTMLElement;
    if(timeBar == undefined) return;
    let d = new Date()
    timeBar.style.bottom = `${1350 - ((d.getHours() - 8 +1) * 75 + (d.getMinutes()*2.5  ))}px`
}

function clearPrevious(calendar: Element) {
    let parent = calendar.getElementsByClassName("rightHours")[0]
    if(parent != null) {
        for (let i = 0; i < parent.children.length; i++) {
            let child = parent.children[i]
            for (let j = 0; j < child.children.length; j++) {
                let child2 = child.children[j]
                child2.innerHTML = "";
            }
        }
    }
}