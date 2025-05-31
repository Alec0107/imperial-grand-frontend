import { validateEmail } from "../authentication/signup.js";

// global var
let div;
let input;
let svg;
let span;

document.addEventListener("DOMContentLoaded", ()=>{
    initGlobalVar();
    initResetPassButton();
    initInputListener();
});


function initGlobalVar(){
  div = document.querySelector(".input-group");
  input = div.querySelector("input");
  svg = div.querySelector("svg");
  span = div.querySelector("span");
}

function initResetPassButton(){
    document.getElementById("reset-pass-btn").addEventListener("click", function(e){
        e.preventDefault();

        // validate email and show UI errors (input and server error)
        const email = document.getElementById("reset-email-input").value;
        console.log(email);

        const result = validateEmail(email);

        if(!result.valid){
          // show the red broder, error icon, error message
          showInputError(result.message);
          return;
        }

        submitResetPassword(email)
    });
}


async function submitResetPassword(email){
      const resendUrl = `http://localhost:8080/api/v1/auth/forgot-password`;
      const object = {
        method: "POST", // 👈 now it's correct
        headers: {
          "Content-Type" :  "application/json"
        },
        body: JSON.stringify({
          email: email
        })
      };

      try{
          const response = await fetch(resendUrl, object);
          const result = await response.json();

          console.log(response);
          console.log("✅ Server responded:", result);


      }catch(err){
        console.log(err);
      }
     
}

function initInputListener(){
  document.getElementById("reset-email-input").addEventListener("input", ()=>{
    clearInputError();
  });
}



// SHOW INPUT ERRORS
function showInputError(msg){
  input.classList.add("show");
  svg.classList.add("show");
  span.textContent = msg;
}

// CLEAN UP INPUT ERRORS
function clearInputError(msg){
  input.classList.remove("show");
  svg.classList.remove("show");
  span.textContent = "";
}


// SHOW SERVER ERRORS



