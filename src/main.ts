import "./css/app.css";
//https://davinci.osiris-student.nl/#/rooster

// document.body.style.border = "5px solid red";
console.log("preload")
setTimeout(function () {
    const observer = new MutationObserver(changed)
    let calendarParent = document.evaluate("/html/body/ion-app/ng-component/ion-split-pane/ion-nav", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(calendarParent == null) return;

    observer.observe(calendarParent, { childList: true, subtree: false })
    
    changed()
    
}, 1000)

function changed () {
    console.log("changed")
    let calendarParent = document.evaluate("/html/body/ion-app/ng-component/ion-split-pane/ion-nav", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(calendarParent == null) return;
    if(calendarParent.firstChild?.parentNode?.children[1].tagName == "PAGE-CALENDAR") {
        var calendar = calendarParent.firstChild?.parentNode?.children[1];
        if(calendar == null) return;
        console.log("found calendar");
        // @ts-ignore
        var dates = calendar.textContent.split("\n").map((i :string) => i.trim()).filter(function(entry : string) {
            return (entry.trim() != '' && entry != "expand_less");
        })
        dates.splice(0, 20)
        dates.pop()
        let days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"]
        for (let i = 0; i < dates.length; i++) {
            let date = dates[i];
            let iExtra = 0;
            if(days.some(p => date.indexOf(p) > -1)) {
                console.log("found day: " + date);
                let dayElement = document.createElement("div");
                dayElement.className = "dayElement";
                dayElement.innerHTML = date;
                calendar.getElementsByClassName("fill-width fill-height")[0].appendChild(dayElement);
                
                iExtra++;
                while(dates[i + iExtra] != null && days.every(p => dates[i+iExtra].indexOf(p) == -1)) {
                    var dateElement = document.createElement("div");
                    dateElement.className = "date";
                    dateElement.innerHTML = dates[i + iExtra];
                    dayElement.appendChild(dateElement);
                    iExtra++;
                }
            }
        }
    }
}