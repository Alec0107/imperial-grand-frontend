

//************************************ SEETING REUSABLE BUTTON'S PROPERTIES ************************************

export function disableButton(button){
  button.disabled = true;
}

export function enableButton(button){
  button.disabled = false;
}


function changeTextAndDisplay(text, loader, removeSpinner, textMsg){
  console.log("** Changing Text and Display **");
  text.textContent = textMsg;
  if(removeSpinner){
    loader.classList.remove("show");
  }else{
    loader.classList.add("show");
  }
}
//************************************ SEETING REUSABLE BUTTON'S PROPERTIES ************************************



/************ FUNCTIONS NEEDED FOR SENDING SIGN UP REQ TO BACKEND (SHOW SERVER'S ERROR AND CLEAN UP) ****************/

function checkStatusCode(statusCode, errorMsg){ // TO CHECK STATUS CODE TO THROW AN EXCEPTION
  console.log(statusCode + ": " + errorMsg);
  if(statusCode === 409 || statusCode === 400 || statusCode === 429 || statusCode === 401 || statusCode === 404){
    throw new Error(errorMsg);
  }
}


function showServerErrorResponse(errorMsg){ //SHOW SERVER ERROR RESPONSE DIV
  // error server container div
  document.querySelectorAll(".server-container-response").forEach(errorDiv =>{
  errorDiv.classList.add("show");
  });

  // error server span inside error container
  document.querySelectorAll(".error-server-message").forEach(msgEl =>{
    msgEl.textContent = errorMsg;
  });

}

function clearServerError(){ //CLEAR SERVER ERROR RESPONSE DIV
  // error server container div
  document.querySelectorAll(".server-container-response").forEach(errorDiv =>{
    errorDiv.classList.remove("show");
  });

  // error server span inside error container
  document.querySelectorAll(".error-server-message").forEach(msgEl =>{
    msgEl.textContent = "";
  });

}
/************ FUNCTIONS NEEDED FOR SENDING SIGN UP REQ TO BACKEND (SHOW SIGN UP SUCCESS MODAL) ****************/

// FUNCTION to show the timer modal response email verif
function showSuccessUi(email){
  document.getElementById("sign-up").classList.remove("show");
  document.getElementById("success-response-div").classList.add("show");
  const modalContent = document.querySelector(".modal-content");
  const header = modalContent.querySelector("h2");
  header.textContent = "Thanks for signing up!";
  document.getElementById("user-email-placeholder").textContent = email;
}

/** TIMER FOR RESEND EMAIL VERIFICATION **/
function startCountdown(expiryTimeStr){
  const expiryTime = new Date(expiryTimeStr);

  const interval = setInterval(()=>{
    const now = new Date();
    const diff = expiryTime - now;

    if(diff <= 0){
      clearInterval(interval);
      document.querySelector(".timer-container").classList.add("hidden"); // adding hidden class to hide the timer container
      document.getElementById("timer").textContent = "";
        // let the user clicks the resend button
      enableButton(document.getElementById("resend-btn"));
      return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000/ 60) % 60);

    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
  }, 1000);
}


//************************************ SHOW FRONTEND'S INPUTS AND CLEAN UP ************************************

function showErrorOnInput(input, svg, span, message){
  span.textContent = message;
  if(svg) svg.style.display = "block";
  input.classList.add("invalid");
}

function clearErrorOnInput(input, svg, span){
  input.addEventListener("input", ()=>{
    span.textContent = "";
    if(svg) svg.style.display = "none";
    input.classList.remove("invalid");
  });
}






//*********  LOGIN: server error response email not verified ********* //

function showServerErrorResponseLogin(errorMsg){ //SHOW SERVER ERROR RESPONSE DIV ALL TYPES OF ERRORS (FOR LOGIN)
  const loginErrorDiv = document.getElementById("login-server-error-div");
  const errorSpan = document.getElementById("server-error-span");

  if (loginErrorDiv && errorSpan) {
    loginErrorDiv.classList.add("show");
    errorSpan.textContent = errorMsg;
  } else {
    console.error("Could not find error elements in DOM");
  }
}

function showServerErrorEmailNotFound(email){ //SHOW SERVER ERROR RESPONSE DIV ONLY FOR EMAIL NOT VERIIFED ERROR (FOR LOGIN)
  document.getElementById("login-email-error-div").classList.add("show");
  
  document.getElementById("resend-here-tag").addEventListener("click", ()=>{
    document.getElementById("login").classList.remove("show");
    document.getElementById("success-response-div").classList.add("show");
    document.getElementById("user-email-placeholder").textContent = email;
    document.querySelector(".timer-container").classList.add("hidden");
    enableButton(document.getElementById("resend-btn"));
  });

}

//*********  LOGIN: server error response email not verified ********* //















export { 
         checkStatusCode,
         startCountdown,
         changeTextAndDisplay,
         showServerErrorResponse, showServerErrorResponseLogin, showServerErrorEmailNotFound,
         clearServerError, 
         showErrorOnInput, clearErrorOnInput,
         showSuccessUi};
