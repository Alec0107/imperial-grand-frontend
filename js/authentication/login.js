import { clearServerError, clearErrorOnInput, showErrorOnInput} from "../utils/authCommon.js";
import { userObjectLogin } from "../userDetailsRelated/userData.js";
import { validateEmail, validatePassword} from "../authentication/signup.js"
import { submitLogin } from "../controller/backendAPI.js";

let spinLoader;
let buttonText;
let emailInput;
let passwordInput;
let loginBtn;

let emailSvgErr;
let emailSpanErr;
let passSvgErr;
let passSpanErr;

function initLoginJs(){
    initLoginClassAndId();
    setupLoginBtn();
}

function initLoginClassAndId(){
    spinLoader = document.querySelector(".spin-loader");
    buttonText = document.querySelector(".btn-text");
    emailInput = document.getElementById("login-email");
    passwordInput = document.getElementById("login-password");
    loginBtn = document.getElementById("login-btn");

    // errors (svg, span)
    emailSvgErr = document.getElementById("email-error-icon-login");
    emailSpanErr = document.getElementById("email-error-span-login");
    passSvgErr = document.getElementById("password-error-icon-login");
    passSpanErr = document.getElementById("password-error-span-login");
}

function setupLoginBtn(){
    loginBtn.addEventListener("click", function(e){
        e.preventDefault();
        console.log("Loging in...");

       // showLoadingUi(); // show user loading circle inside the button
        clearServerError();
    
        //  validate email and pass and set the userobject valid to either true/false
        validateFieldTextLogin(emailInput, emailSvgErr, emailSpanErr, validateEmail, "email");
        validateFieldTextLogin(passwordInput, passSvgErr, passSpanErr, validatePassword, "password");

        if(!userObjectLogin.allValid){
            console.log("Input Fields Login Error! Unable to send to the backend server");
            return;
        }

        console.log(userObjectLogin.userAccount);
        // calling controller (backendAPI.js file)
        // fn: submitLogin
        submitLogin();
    });
}


function validateFieldTextLogin(input, svg, span, validatorFn, userKey){
    const result = validatorFn(input.value);
    if(!result.valid){
        showErrorOnInput(input, svg, span, result.message);
        userObjectLogin.allValid = false;
    }else{
        userObjectLogin.userAccount[userKey] = input.value;
    }
    clearErrorOnInput(input, svg, span);
}


function showLoadingUi(){
    spinLoader.classList.add("show");
    buttonText.textContent = "Logging in...";
}

function resetUi(){
    spinLoader.classList.remove("show");
    buttonText.textContent = "Log in";
}

function resetUserObjectlogin(){
    userObjectLogin.allValid = true;
    userObjectLogin.userAccount = {
        email: "",
        password: ""
    };
}



//******************* FOR SENDING COOKIE JWT TESTS *******************
// async function sendTestCookie(){
//     console.log("Sending test...")

//     const response = await fetch("http://localhost:8080/api/v1/auth/detailsTest", {
//         method: "GET",
//         credentials: "include"
//     });

//     const result = await response.text();
//     console.log("TEST COOKIE: \n" + "Response: " + response + "\n" + "Result: " + result);
// }









export {
    initLoginJs
}