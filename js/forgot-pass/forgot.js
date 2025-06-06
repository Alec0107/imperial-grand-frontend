import { validateEmail } from "../authentication/signup.js";
import { showSpinner, removeSpinner} from "../../components/reusable-buttons.js";
import { API } from "../APIurl/api.js"

// global var
let div;
let input;
let svg;
let span;
let resetButton;
let flashFullDiv;

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
  resetButton = document.getElementById("reset-pass-btn");
  flashFullDiv = document.querySelector(".flash-full");
}

function initResetPassButton(){
    resetButton.addEventListener("click", function(e){
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
        console.log("FORGOT PASSWORD: Sending email...")
        submitResetPassword(email)
    });
}


async function submitResetPassword(email){
      const resendUrl = API.authentication.forgotPassword; // Backend URL for users to receive reset pass link via sending email
      const object = {
        method: "POST", // 👈 now it's correct
        headers: {
          "Content-Type" :  "application/json"
        },
        body: JSON.stringify({
          email: email
        })
      };

      // get the spinner and span to show the spinner
      const spinner = resetButton.querySelector(".spin-loader");
      const spanBtnLabel = resetButton.querySelector(".btn-text");
      showSpinner(spinner, spanBtnLabel, "Sending reset link...");

      try{
          const response = await fetch(resendUrl, object);
          const result = await response.json();

          if(!response.ok){
            throw new Error("Failed to fetch.");
          }

          // show success fetch result
          console.log(response);
          console.log("✅ Server responded:", result);
          const message = document.createElement("p");
          message.classList.add("font-ui");
          message.innerHTML = `We have e-mailed your password <br>reset link!`
          showSuccessDiv(message)

          
      }catch(err){
        console.error("❌ Error:", err);
        // TODO: Show error message to user
      }finally{
        // close or undo resources
        removeSpinner(spinner, spanBtnLabel, "Send password reset email");
      }
     
}

function initInputListener(){
  document.getElementById("reset-email-input").addEventListener("input", ()=>{
    clearInputError();
    clearFlashFullDIv();
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

// SHOW SUCCESS RESPONSE
function showSuccessDiv(message){
  // adding classlist "show" to be visible
  flashFullDiv.classList.add("show");

  // Before appending iterate the error div if it has the p tag alr if so remove
  flashFullDiv.querySelectorAll("p").forEach(p => p.remove());

  // appending the p tag inside the div
  flashFullDiv.appendChild(message);
}

// CLEAR SUCCESS RESPONSE DIV
function clearFlashFullDIv(){
  flashFullDiv.classList.remove("show");
}


// SHOW SERVER ERRORS



