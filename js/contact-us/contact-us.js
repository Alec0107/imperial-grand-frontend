let dropdownBtn;
let subjectOption;

let isOpen = false; // to toggle dropdown button open/close

document.addEventListener("DOMContentLoaded", ()=>{
    initGlobalVar();
    initSubjectDropdown();
});


function initGlobalVar(){
    dropdownBtn = document.getElementById("subject-btn");
    subjectOption = document.querySelector(".subject-options");
}


function openDropDown(){
    subjectOption.classList.add("open");
    isOpen = true;
}

function closeDropDown(){
     subjectOption.classList.remove("open");
    isOpen = false;
}

function initSubjectDropdown(){
    // Close dropdown if clicked button 
    dropdownBtn.addEventListener("click", (e) => {
        e.preventDefault();
       if(!isOpen){
        openDropDown();
       }else{
        closeDropDown();
       }
    });

    // Close dropdown if user clicks any <li> item
    subjectOption.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () =>{
            const data = li.textContent;
            console.log(data);
            closeDropDown();
        });
    });

    // Close dropdown if clicked outside the button or dropdown list
    document.addEventListener("click", (e) =>{
        if(!subjectOption.contains(e.target) && !dropdownBtn.contains(e.target)){
            closeDropDown();
        }
    });
}

