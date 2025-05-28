//import { resetUserObjectlogin } from "../authentication/login.js";
import { userObject, userObjectLogin, resetUserObjectSignUp, resetUserObjectLogin} from "../userDetailsRelated/userData.js";
import {checkStatusCode, startCountdown, showServerErrorResponse, showServerErrorResponseLogin, changeTextAndDisplay, showSuccessUi, disableButton, showServerErrorEmailNotFound, enableButton} from "../utils/authCommon.js";

// GLOBAL VAR
let resendButton; // resend



// SUBMIT SIGN UP 
async function sendToBackend(){
  //localStorage.setItem("userEmail", userObject.userAccount.email);
  const registerURL = `http://localhost:8080/api/v1/auth/register`;
  const object = {
    method: "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(userObject.userAccount)
  }

  const signupBtn = document.getElementById("signup-btn");
  const textBtn   = signupBtn.querySelector(".btn-text");
  const loaderBtn = signupBtn.querySelector(".spin-loader"); 

  // disable button & change the text button to ("Submitting...")
  
  //setButtonStatus(signupBtn, true);
  disableButton(signupBtn);
  changeTextAndDisplay(textBtn, loaderBtn, false, "Submitting...");


  try{
    const response = await fetch(registerURL, object);
    const result = await response.json();

    // check if the response is success
    if(!response.ok){
      console.log(response);
      console.log(result);
      resetUserObjectSignUp(); // ✅ reset after failed attempt
      checkStatusCode(result.statusCode, result.message);
    }

    console.log(response);
    console.log(result);

    //setButtonStatus(signupBtn, false);
    enableButton(signupBtn);
    changeTextAndDisplay(textBtn, loaderBtn, true, "Sign up");

    showSuccessUi(result.data.email); // show success ui and email that was sent the email verif to
    startCountdown(result.data.expiryTime);  // show timer

    // initialize the resend email verification link button once registration is success
    setUpResendBtn(userObject.userAccount.email);

    //resetUserObjectSignUp(); // ✅ reset userObject after successful signup

  }catch (err){
    console.error("Caught error in submit Signup:", err);
    //setButtonStatus(signupBtn, false);
    enableButton(signupBtn);
    changeTextAndDisplay(textBtn, loaderBtn, true, "Sign up");

    resetUserObjectSignUp(); // ✅ reset on network or unexpected errors

    if(err instanceof TypeError && err.message === "Failed to fetch"){
      showServerErrorResponse("Cannot connect to the server. Please ensure the backend is running.");
    }else {
      showServerErrorResponse(err.message)
    }

  }
}

// SUBMIT LOG IN
async function submitLogin(){

  const loginUrl = `http://localhost:8080/api/v1/auth/login`;
  const requestObject = {
    method: "POST", // 👈 now it's correct
    headers: {
      "Content-Type" :  "application/json"
    },
    credentials: "include", // REQUIRED to receive/set HttpOnly cookie
    body: JSON.stringify(userObjectLogin.userAccount)
  };

  const loginButton = document.getElementById("login-btn");
  const textButton = loginButton.querySelector(".btn-text");
  const loaderButton = loginButton.querySelector(".spin-loader");

  // show the spin-loader from authCommon.js
  //setButtonStatus(loginButton, true);
  disableButton(loaderButton);
  changeTextAndDisplay(textButton, loaderButton, false, "Loggin in...");

  try{
    const response = await fetch(loginUrl, requestObject);
    const result = await response.json();

    if(!response.ok){
      checkStatusCode(result.statusCode, result.message);
    }
    enableButton(loginButton);
    changeTextAndDisplay(textButton, loaderButton, true, "Log in");

    console.log(response);
    console.log(result);
   

  }catch(err){
    console.error("Error message:", err.message);
    enableButton(loginButton);
    changeTextAndDisplay(textButton, loaderButton, true, "Log in");

    if (err instanceof TypeError && err.message === "Failed to fetch") {
      showServerErrorResponseLogin("Cannot connect to the server. Please ensure the backend is running.");
      resetUserObjectLogin(); // Reset Clean up

    } else if(err.message.toLowerCase().includes("email is not verified")){
      // show serverErrorResponse but wiht inner html
      console.log("Executing innerHTML");
      // show click here to resend email verif UI
      showServerErrorEmailNotFound(userObjectLogin.userAccount.email);
      setUpResendBtn(userObjectLogin.userAccount.email);

    }else {
      showServerErrorResponseLogin(err.message); // You missed this!
      resetUserObjectLogin(); // Reset Clean up 
    }
  }
}



// AFTER SIGN UP AN EMAIL VERIFICATION MODAL WITH 
// TIMER MUST BE SHOWN AND SUBMIT RESEND EMAIL VERIF (WHEN SERVER RESPONSE EMAIL NOT VERIIFED)
function setUpResendBtn(email){
  resendButton = document.getElementById("resend-btn");

  resendButton.addEventListener("click", async function(e){
    e.preventDefault();

      const resendUrl = `http://localhost:8080/api/v1/auth/resend-verification?email=${email}`;
      const object = {
        method: "POST", // 👈 now it's correct
        headers: {
          "Content-Type" :  "application/json"}
      };

      console.log(resendUrl);
      console.log(object);
      try {
        const response = await fetch(resendUrl, object);
        const result = await response.json();

        if(!response.ok){
          checkStatusCode(result.statusCode, result.message);
        }

        console.log(result);
        document.querySelector(".timer-container").classList.remove("hidden"); // show the div timer-container
        disableButton(resendButton);
        startCountdown(result.data.expiryTime);  // show timer

      }catch (err){
        // show a modal or dialog that indicates resend req was failed or too many attempts
        console.log(err)
      }

  });
}





export{
  setUpResendBtn,
  submitLogin, 
  sendToBackend
};
