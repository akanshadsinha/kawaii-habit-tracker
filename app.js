document.addEventListener("DOMContentLoaded", function () {
    var date = new Date();
    var curr_year = date.getFullYear();
    var curr_month = date.getMonth();
    var curr_date = date.getDate();
    var day = date.getDay();

    //month info
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    
    //Set current month
    var title = document.getElementById('title');
    title.innerHTML = "🌸" + months[curr_month] + "🌸";

    var habitTitle = document.getElementById("habitTitle");
    habitTitle.onclick = function() {
        let habits = prompt("What's your habit?", habitTitle.innerHTML);
        if(habits === null || habits.length === 0){
            habitTitle.innerHTML = "Click to set your habit";
        } else {
            habitTitle.innerHTML = habits;
        }
    }

    var daysInMonthList = [31,28,31,30,31,30,31,31,30,31,30,31];
    // Check for leap year
    if (curr_year % 4 === 0 && (curr_year % 100 !== 0 || curr_year % 400 === 0)) {
        daysInMonthList[1] = 29;
    }
    var daysInMonth = daysInMonthList[curr_month];
    var daysCompleted = 0;
    var totalDays = document.getElementById("totalDays");

    //week header
    var tracker = document.getElementById("tracker");
    var daysOfWeekHeader = document.createElement("div");
    daysOfWeekHeader.className = "days-of-week";
    daysOfWeekHeader.innerHTML = `
        <div class="day-name">Sun</div>
        <div class="day-name">Mon</div>
        <div class="day-name">Tue</div>
        <div class="day-name">Wed</div>
        <div class="day-name">Thu</div>
        <div class="day-name">Fri</div>
        <div class="day-name">Sat</div>
    `;
    tracker.insertBefore(daysOfWeekHeader, tracker.firstChild);

    // Calculate what day of the week the 1st falls on
    var firstDay = new Date(curr_year, curr_month, 1);
    var firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    //setup calendar days
    var dayCount = 0;
    var rowCount = 0;
    var days = document.getElementsByClassName("days");
    var currentCell = 0;
    
    for (var i = 0; i < days.length; i++) {
        var day = days[i].getElementsByClassName("day");
        for(var j = 0; j < day.length; j++){
            // Skip cells until we reach the first day of the month
            if(currentCell < firstDayOfWeek){
                day[j].innerHTML = "";
                day[j].style.backgroundColor = "transparent";
                day[j].style.cursor = "default";
                day[j].style.border = "none";
            } 
            //actual days of the month
            else if(dayCount < daysInMonth){
                day[j].innerHTML = dayCount + 1;
                day[j].setAttribute("id","day"+(dayCount + 1));
                
                //current day
                if(dayCount === curr_date - 1){
                    day[j].style.color = "rgb(234,1,144)";
                    day[j].style.border = "2px solid black";
                }
                dayCount++;
            } 
            // Empty cells after the month ends
            else {
                day[j].innerHTML = "";
                day[j].style.backgroundColor = "transparent";
                day[j].style.cursor = "default";
                day[j].style.border = "none";
            }
            currentCell++;
        }
    }

    // Initialize completed tracking
    function getStorageKey(dayNum) {
        return curr_month + "-" + dayNum + "-" + curr_year;
    }

    //update completed array
    for(var i = 1; i <= daysInMonth; i++){
        var temp = getStorageKey(i);
        var tempDay = localStorage.getItem(temp);
        
        if(tempDay === null || tempDay === "false"){
            localStorage.setItem(temp, "false");
        } else if(tempDay === "true"){
            daysCompleted++;
        }
    }

    // Update the display
    totalDays.innerHTML = daysCompleted + "/" + daysInMonth;

    for(var i = 1; i <= daysInMonth; i++){
        var temp = getStorageKey(i);
        var chosenDay = localStorage.getItem(temp);
        var chosenDayDiv = document.getElementById("day" + i);
        
        if(chosenDayDiv){
            if(chosenDay === "true"){
                chosenDayDiv.style.backgroundColor = "pink";
            } else {
                chosenDayDiv.style.backgroundColor = "white";
            }
        }
    }

    // click handlers only up to current date
    for(var i = 1; i <= daysInMonth; i++){
        var dayDiv = document.getElementById("day" + i);
        if(dayDiv){
            if(i <= curr_date){
                dayDiv.onclick = function(e){
                    var dayNumber = parseInt(e.target.innerHTML);
                    var storageKey = getStorageKey(dayNumber);
                    var currentState = localStorage.getItem(storageKey);
                    
                    if(currentState === "true"){
                        localStorage.setItem(storageKey, "false");
                        e.target.style.backgroundColor = "white";
                        daysCompleted--;
                    } else {
                        localStorage.setItem(storageKey, "true");
                        e.target.style.backgroundColor = "pink";
                        daysCompleted++;
                    }
                    
                    totalDays.innerHTML = daysCompleted + "/" + daysInMonth;
                };
            } else {
                // Future dates 
                dayDiv.style.opacity = "0.3";
                dayDiv.style.cursor = "not-allowed";
                dayDiv.onclick = null;
            }
        }
    }

    //reset button functionality
    var resetBtn = document.getElementById("resetBtn");
    if(resetBtn){
        resetBtn.onclick = function(){
            if(confirm("Are you sure you want to reset all progress for this month?")){
                // Clear all days for current month
                for(var i = 1; i <= daysInMonth; i++){
                    var storageKey = getStorageKey(i);
                    localStorage.setItem(storageKey, "false");
                    
                    var dayDiv = document.getElementById("day" + i);
                    if(dayDiv){
                        dayDiv.style.backgroundColor = "white";
                    }
                }
                
                daysCompleted = 0;
                totalDays.innerHTML = daysCompleted + "/" + daysInMonth;
                
                // Reset habit title
                habitTitle.innerHTML = "Click to set your habit";
            }
        };
    }
});
