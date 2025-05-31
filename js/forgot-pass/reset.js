import { validatePassword } from "../authentication/signup.js";

// global var
let resetForm;
let passwordInput;
let confirmPassInput;
let passErrorIcon;
let passErrorMsg;
let errorDiv;
let paswordValid = false;

let newPassObject = {
    token: "",
    tokenId: "",
    newPassword: "",
}

document.addEventListener("DOMContentLoaded", function(){
    initGlobalVar();
    initToken();
    initPasswordInputListener();
    initSubmitChangePassword();
    initCloseErrorBtn();
});


function initGlobalVar(){
    passwordInput = document.getElementById("password");
    confirmPassInput = document.getElementById("confirm-password");
    passErrorIcon = document.getElementById("password-error-icon-login");
    passErrorMsg = document.getElementById("password-error-span-login");
    resetForm = document.getElementById("reset-password-form");
    errorDiv = document.querySelector(".flash-full");
}

function initToken(){
    const params = new URLSearchParams(window.location.search);
    newPassObject.token = params.get("token");
    newPassObject.tokenId = params.get("id");
}

function initCloseErrorBtn(){
    document.getElementById("close-error-btn").addEventListener("click", ()=>{
        errorDiv.classList.remove("show")
    });
}

function initPasswordInputListener(){
    passwordInput.addEventListener("input", ()=>{
        const password = passwordInput.value;
        //console.log(password);
        const result = validatePassword(password);
        const message = result.message;
        paswordValid = result.valid;

        if (password === ""){
            clearErrorInput();
        }else if (!result.valid){
            showErrorInput(message);
        }else {
            clearErrorInput();
        }
    });
}


function initSubmitChangePassword(){
    resetForm.addEventListener("submit", function(e){
        e.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPassInput.value;

        if(!paswordValid){
            console.log("Password is not valid");
            return;
        }

        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            // You can also show UI error here for confirm password
            const message = document.createElement("p");
            message.classList.add("font-ui");
            message.innerHTML = `Password confirmation doesn't<br> match the password`;
            showErrorDiv(message);
            return;
        }

        // ✅ All good — send to backend
        console.log("Submitting new password:", password);
        // Your fetch() call here to change the password
        // validate if newPassObject is not empty or null
        if(!newPassObject.token || !newPassObject.tokenId){
            const message = document.createElement("p");
            message.classList.add("font-ui");
            message.innerHTML = `Reset link is invalid or expired. <br>Please request a new one.`;
            showErrorDiv(message);
            return;
        }
        console.log("Valid");
        
        // if valid proceed in sending the request
        newPassObject.newPassword = password;

        submitResetPassword();
        

    });
}


function showErrorInput(errorMessage){
    passwordInput.classList.add("show");
    passErrorIcon.classList.add("show");
    passErrorMsg.classList.add("show")
    passErrorMsg.textContent = errorMessage;
    console.log(errorMessage);
}

function clearErrorInput(){
    passwordInput.classList.remove("show");
    passErrorIcon.classList.remove("show");
    passErrorMsg.classList.remove("show")
}


function showErrorDiv(message){
    errorDiv.classList.add("show");

    // Before appending iterate the error div if it has the p tag alr if so remove
    errorDiv.querySelectorAll("p").forEach(p => p.remove());

    errorDiv.appendChild(message)
}

async function submitResetPassword(){

  const resetPassURL = `http://localhost:8080/api/v1/auth/reset-password`;
  const object = {
    method: "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(newPassObject)
  }

  try{
    const response = await fetch(resetPassURL, object);
    const result = await response.json();

    console.log(response);
    console.log(result);

  }catch (err){
    console.error("Caught error in submit Signup:", err);

    // if(err instanceof TypeError && err.message === "Failed to fetch"){
    
    // }else {
      
    // }

  }


}