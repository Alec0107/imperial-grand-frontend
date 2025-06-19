
let body;
initBody();
initBtn();

let isDark = false;

function initBody(){
    body = document.body;
}

function initBtn(){
    const btn = document.querySelector(".btn");

    btn.addEventListener("click", () => {
        if(!isDark){
            darkMode();
        }else{
           lightMode();
        }
    });

}



function darkMode(){
    body.classList.add("dark");
    isDark = true;
}


function lightMode(){
    body.classList.remove("dark");
    isDark = false;
}
