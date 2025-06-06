import { validatePassword } from "../authentication/signup.js";
import { showSpinner, removeSpinner} from "../../components/reusable-buttons.js";
import { checkStatusCode } from "../utils/authCommon.js";
import { API } from "../APIurl/api.js";


// global var
let resetForm;
let passwordInput;
let confirmPassInput;
let passErrorIcon;
let passErrorMsg;
let errorDiv;
let changePassBtn;
let closeErrorBtn;
let headerDiv;
let paswordValid = false;

let newPassObject = {
    token: "",
    tokenId: "",
    newPassword: "",
}

document.addEventListener("DOMContentLoaded", function(){
    initToken(); // initialize the token
    initGlobalVar(); // initalize global vars
    checkTokenValidity();

    initPasswordInputListener();
    initSubmitChangePassword();
    initCloseErrorBtn();
    initSignInBtn();
});

function initToken(){
    const params = new URLSearchParams(window.location.search);
    newPassObject.token = params.get("token");
    newPassObject.tokenId = params.get("id");
}

/******************* MODALS RELATED *******************/
async function checkTokenValidity(){
    console.log("Validating reset token...");
    const validateResetTokenURL = API.authentication.validateResetToken(newPassObject.token, newPassObject.tokenId);
    const object = {
    method: "GET",
    headers : {
      "Content-Type" : "application/json"
    }
  }

  try{
    const response = await fetch(validateResetTokenURL, object);
    const result = await response.json();

    if(!response.ok){
        console.log(response);
        console.log(result)
        checkStatusCode(result.statusCode, result.error);
    }
    // if no issues / errors then show the reset form 
    showResetForm();
  }catch(err){
    // if has error show the error/invalid modal
    showErrorModal();
  }

}

function showErrorModal(){
    document.getElementById("reset-pass-div").classList.remove("show");
    document.getElementById("reset-success-div").classList.remove("show");
    document.getElementById("invalid-reset-link").classList.add("show");
}

function showResetForm(){
    document.getElementById("invalid-reset-link").classList.remove("show");
    document.getElementById("reset-success-div").classList.remove("show");
    document.getElementById("reset-pass-div").classList.add("show");
}

function showSuccessModal(){
    document.getElementById("reset-pass-div").classList.remove("show");
    document.getElementById("invalid-reset-link").classList.remove("show");
    document.getElementById("reset-success-div").classList.add("show");
}

/******************* GLOBAL VAR INITIALIZATION*******************/
function initGlobalVar(){
    passwordInput = document.getElementById("password");
    confirmPassInput = document.getElementById("confirm-password");
    passErrorIcon = document.getElementById("password-error-icon-login");
    passErrorMsg = document.getElementById("password-error-span-login");
    resetForm = document.getElementById("reset-password-form");
    errorDiv = document.querySelector(".flash-full");
    changePassBtn = document.getElementById("change-pass-btn");
    closeErrorBtn = document.getElementById("close-error-btn");
    headerDiv = document.querySelector(".header-div");
}

/******************* X BUTTON TO CLOSE THE ERROR DIC *******************/
function initCloseErrorBtn(){
    closeErrorBtn.addEventListener("click", ()=>{
        errorDiv.classList.remove("show")
    });
}

// function that shows and remove input errors (input border, svg, and span)
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

// function that shows flash error div above the form remove
function showErrorDiv(message){
    // adding classlist "show" to be visible
    errorDiv.classList.add("show");

    // Before appending iterate the error div if it has the p tag alr if so remove
    errorDiv.querySelectorAll("p").forEach(p => p.remove());

    // appending the p tag inside the div
    errorDiv.appendChild(message)
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


        // validate if newPassObject token and token id is not empty or null
        if(!newPassObject.token || !newPassObject.tokenId){
            const message = document.createElement("p");
            message.classList.add("font-ui");
            message.innerHTML = `Reset link is invalid or expired. <br>Please request a new one.`;
            showErrorDiv(message);
            return;
        }

        newPassObject.newPassword = password;
        // If valid proceed in sending the request
        console.log("Valid");
        // Your fetch() call here to change the password
        submitResetPassword();

    });
}


async function submitResetPassword(){
  const resetPassURL = API.authentication.resetPassword;
  const object = {
    method: "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(newPassObject)
  }

  const spinner = changePassBtn.querySelector(".spin-loader");
  const spanBtnLabel = changePassBtn.querySelector(".btn-text");
  showSpinner(spinner, spanBtnLabel, "Changing password...");

  try{
    const response = await fetch(resetPassURL, object);
    const result = await response.json();

    if(!response.ok){
        console.log(result.error);
        console.log(result);
        checkStatusCode(result.statusCode, result.error);
    }

    console.log(response);
    console.log(result);
    // show success modal ui
    showSuccessModal();


  }catch (err){
    console.error("Caught error in :", err);

    if(err.message.includes("TOKEN_EXPIRED") || err.message.includes("INVALID_RESET_TOKEN")){
        const message = messageMaker(`It looks like you clicked on an invalid 
                                    <br>or expired password reset link. 
                                    <a id="force-login" href="#">Please request a new one.</a>`);
        
        closeErrorBtn.classList.add("hidden"); // to hide the close x button of the error div
        headerDiv.querySelector("h2").textContent = "Link Invalid!";
        headerDiv.querySelector("p").textContent = "";
        resetForm.classList.add("hidden"); // hide the form s users only have the option to go back login then req a new reset link
        showErrorDiv(message); // show the error div 

        // find the force-login and redirect user to send email reset link (event bubbling)
        errorDiv.addEventListener("click", function(e){
            if(e.target.id === "force-login"){
                e.preventDefault();
                window.location.replace("../../pages/authentication/auth.html?authType=login");
            }
        });


        return;
    }
    // if(err instanceof TypeError && err.message === "Failed to fetch"){
    
    // }else {
      
    // }
  }finally{
    removeSpinner(spinner, spanBtnLabel, "Change password");
  }


}


function messageMaker(errorMsg){
    const message = document.createElement("p");
    message.classList.add("font-ui");
    message.innerHTML = errorMsg;
    return message;
}


// SUCCESS DIV
function initSignInBtn(){
    document.querySelectorAll(".signin").forEach(btn => btn.addEventListener("click", function(e){
        window.location.replace("../../pages/authentication/auth.html?authType=login");
    }));


}