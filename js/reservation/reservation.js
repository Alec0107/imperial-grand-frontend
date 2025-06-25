
// calendar global vars
let daysContainer;
let prevMonthSelector;
let nextMonthSelector;
let currentYear;
let currentMonth;
let yearMonthTag;
let currentDay;


// dropdown global vars
let isGuestDropDownOpen = false;

let guestDropdown;
let timeDropdown;

let guestOptions;
let timeOptions;

const ReservationFirstStep = {
    Date: "",
    NumberOfPeople: 0,
    Time: ""
}



document.addEventListener("DOMContentLoaded", ()=>{
    initGlobalVars();
    initCurrentCalendarDate();
    initMonthSelector();

    initNumberOfGuestSelector();
    initTimeSelector();

});

function initGlobalVars(){
    daysContainer = document.getElementById("calendar-days");
    prevMonthSelector  = document.querySelector(".prev-month");
    nextMonthSelector  = document.querySelector(".next-month");
    yearMonthTag = document.querySelector(".year-month");

    guestDropdown = document.getElementById("guest-dropdown");
    timeDropdown = document.getElementById("time-dropdown");
    guestOptions = document.querySelectorAll(".options")[0]; // first options which is the guest number options
    timeOptions = document.querySelectorAll(".options")[1]; // second options which is the time options
}

function initCurrentCalendarDate(){
    const date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth();
    renderCalendar(currentYear, currentMonth);
    setMonthYearString(currentYear, currentMonth);
}

function initMonthSelector(){
    prevMonth();
    nextMonth();
}


function renderCalendar(year, month){
    const date = new Date();
    const dateNow = date.getDate();
    const monthNow = date.getMonth();
    const yearNow = date.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    daysContainer.innerHTML = "";

    for(let i = 0; i < firstDay; i++){
        const empty = document.createElement("div");
        empty.classList.add("day", "empty");
        daysContainer.appendChild(empty);
    }

    for(let i = 1; i <= lastDay; i++){
        const day = document.createElement('div');
        day.innerText = i;
        day.classList.add("day", "font");

        if(i < dateNow && (currentMonth === monthNow && currentYear === yearNow)){
            day.classList.add("past-days")
        }else if(i === dateNow && currentMonth === monthNow){
            day.classList.add("selected-day", "active-days");
            day.setAttribute("data-number", i); 
            addListenerToFutureDays(day);
     
        }else{
           day.classList.add("future-days", "active-days");
           day.setAttribute("data-number", i); 
           addListenerToFutureDays(day);
        }

        daysContainer.appendChild(day);
    }

}

function addListenerToFutureDays(day){
    day.addEventListener("click", function() {

       document.querySelectorAll(".active-days").forEach((dayEl) => {
         dayEl.classList.remove("selected-day");
       });

       this.classList.add("selected-day");

       currentDay = this.dataset.number;
       const dayStr = String(currentDay).padStart(2, "0")
       const monthStr = String(currentMonth + 1).padStart(2, "0");

       ReservationFirstStep.Date = `${currentYear}-${monthStr}-${dayStr}`;
       console.log(ReservationFirstStep.Date);
    });
}

function prevMonth(){
    prevMonthSelector.addEventListener("click", () =>{
        const date = new Date();
        const todayMonth = date.getMonth();
        const todayYear= date.getFullYear();

        const canGoBack = currentYear > todayYear || (currentYear === todayYear && currentMonth > todayMonth);

        if(canGoBack){
            currentMonth--;
            if(currentMonth < 0){
                currentMonth = 11;
                currentYear--;
             }
        }
    
        renderCalendar(currentYear, currentMonth);
        setMonthYearString(currentYear, currentMonth);
    });
}

function nextMonth(){
    nextMonthSelector.addEventListener("click",() =>{
        const date = new Date();
        const todayMonth = date.getMonth();
        const todayYear= date.getFullYear();

        let maxMonth = todayMonth + 2;
        let maxYear = todayYear;

        if(maxMonth > 11){
            maxMonth = maxMonth % 12
            maxYear += 1;
        }

        const canGoNext = currentYear < maxYear || (currentYear === maxYear && currentMonth < maxMonth);

        if(canGoNext){
            currentMonth++;
            if(currentMonth > 11){
                currentMonth = 0;
                currentYear++;
            }
        }
     
        renderCalendar(currentYear, currentMonth);
        setMonthYearString(currentYear, currentMonth);
    });
}


function setMonthYearString(year, month){
    const monthString = new Date(year, month).toLocaleDateString("default", {
        month: "short"
    })

    yearMonthTag.textContent = `${monthString} ${currentYear}`;
}




// function for dropdowns (number of guest, time)
function initNumberOfGuestSelector(){


    guestDropdown.addEventListener("click", ()=>{

        if(!isGuestDropDownOpen){
            openGuestDropdown();
        }else{
            closeGuestDropdown();
        }
    });

    document.addEventListener("click", (e) => {
        if(!guestOptions.contains(e.target) && !guestDropdown.contains(e.target)){
            closeGuestDropdown();
            console.log("clicked outside!")
        }else{
            console.log("clicked inside")
        }
    });

}


function openGuestDropdown(){
    const ulOptionsGuest = guestDropdown.querySelector(".options");
    ulOptionsGuest.classList.add("open");
    isGuestDropDownOpen = true;
}

function closeGuestDropdown(){
    const ulOptionsGuest = guestDropdown.querySelector(".options");
    ulOptionsGuest.classList.remove("open");
    isGuestDropDownOpen = false;
}

function initTimeSelector(){

}

