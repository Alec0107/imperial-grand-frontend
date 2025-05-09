
document.addEventListener("DOMContentLoaded", function () {
  initPhoneNumber()         // 📱 intl-tel-input setup ✅
  liveEventConfirmPass();    // 🧠 confirm pass validator ✅
  liveEventPhoneNumber();    // 📞 live clear for phone ✅
  submitBtn();               // 🚀 attach button logic ✅
});

let iti;

function initPhoneNumber() {
  const phoneInput = document.getElementById("phoneNo");

  iti = window.intlTelInput(phoneInput, {
    initialCountry: "sg", // or auto
    separateDialCode: false,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });
}






// submit to validate and submit the form to the backend
function submitBtn() {
  document.getElementById("signup-btn").addEventListener("click", function (e) {
    e.preventDefault();
    clearServerError();

    const form = document.getElementsByClassName("input-fields-grid")[0];
    const divs = form.querySelectorAll("div");

    //iterate divs from the form tag
    // if valid send the user credentials to the server
    const result = iterateDivs(divs);
    if (!result.allValid) {
      console.log("Invalid. Unable to send to the backend server.")
      return;
    }

    sendToBackend(result.userAccount);
  });

}





function iterateDivs(divs){
  const userObject ={
    allValid: true,
    userAccount : {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dob: "2005-10-24"
    }
  }

  //  validate phone number
  const phoneInput = document.getElementById("phoneNo");
  const phoneSvg = document.getElementById("phoneNo-icon")
  const phoneSpan = document.getElementById("phoneNo-error");

  const phoneValidateResult = validatePhoneNumber(iti); // ✅ don't forget `()`
  if (!phoneValidateResult.valid) {
    callErrorOnInput(phoneInput, phoneSvg, phoneSpan, phoneValidateResult.message);
    userObject.allValid = false;
  } else {
    userObject.userAccount.phoneNumber = iti.getNumber().trim();
  }
  const fullPhone = iti.getNumber().trim(); // ✅ e.g. "+6593556900"
  const isValid = iti.isValidNumber(); // ✅ returns true or false

  console.log("📞 Full phone #:", fullPhone);
  console.log("✅ Is valid:", isValid);




  divs.forEach((div) =>{
    console.log("test")
    const input = div.querySelector("input");
    const svg = div.querySelector("svg");
    const span = div.querySelector("span");
    let result;

    if (!input) return; // 🚨 skip if no input found (avoids crash)

    switch(input.id){
      case "firstName":
        result = validateFirstName(input.value);
        if (!result.valid) {
          callErrorOnInput(input, svg, span, result.message);
          userObject.allValid = false;
        }else{
          userObject.userAccount.firstName = input.value;
        }
        clearErrorOnInput(input, svg, span);
        break;

      case "lastName":
        result = validateLastName(input.value);
        if (!result.valid) {
          callErrorOnInput(input, svg, span, result.message);
          userObject.allValid = false;
        }else{
          userObject.userAccount.lastName = input.value;
        }
        clearErrorOnInput(input, svg, span);
        break;

      case "email":
        result = validateEmail(input.value);
        if(!result.valid){
          callErrorOnInput(input, svg, span, result.message);
          userObject.allValid = false;
        }else{
          userObject.userAccount.email = input.value;
        }
        clearErrorOnInput(input, svg, span);
        break;

      // phone number is already checked since its inside of an inside div
      case "phoneNo":
        break; // we skip already been validated outside the forEach

      case "password":
        result = validatePassword(input.value);
        if(!result.valid){
          callErrorOnInput(input, svg, span, result.message);
          userObject.allValid = false;
        }else{
          userObject.userAccount.password = input.value;
        }
        clearErrorOnInput(input, svg, span);
        break;

      case "confirmPass":
        const password = document.getElementById("password").value;
        if(password !== input.value){
          callErrorOnInput(input, svg, span, "Passwords do not match.")
          userObject.allValid = false;
        }

        if(password === ""){
          callErrorOnInput(input, svg, span, "Confirm password is empty.")
          userObject.allValid = false;
        }
        break;
    }

  });


  return userObject;
}

function validateFirstName(fName){
  const firstNamePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;

  if(fName === ""){
    return { valid : false, message: "First name is required." };
  }

  if(fName.length < 3 || fName.length > 30){
    return { valid: false, message: "First name must be between 3 and 30 characters." };
  }

  if(!firstNamePattern.test(fName)){
    return { valid: false, message: "Please enter a valid First name" };
  }

  return { valid:true }
}

function validateLastName(lName){
  const lastNamePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;

  if(lName === ""){
    return { valid : false, message: "Last name is required." };
  }

  if(lName.length < 3 || lName.length > 30){
    return { valid: false, message: "Last name must be between 3 and 30 characters." };
  }

  if(!lastNamePattern.test(lName)){
    return { valid: false, message: "Please enter a valid Last name." };
  }

  return { valid:true }
}

function validateEmail(email){
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if(email === ""){
    return { valid : false, message: "Email is required." };
  }

  if(!emailPattern.test(email)){
    return { valid: false, message: "Please enter a valid Email format" };
  }

  return { valid: true }
}

function validatePassword(password){
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if(password === ""){
    return { valid : false, message: "Password is required." };
  }

  if(password.length < 8){
    return { valid : false, message: "Password length must be at least 8 characters." };
  }

  if(!/[A-Z]/.test(password)){
    return { valid : false, message: "Missing uppercase letter." };
  }

  if(!/[a-z]/.test(password)){
    return { valid : false, message: "Missing lowercase letter." };
  }

  if(!/\d/.test(password)){
    return { valid : false, message: "Must have at least one number." };
  }

  if(!/[@$!%*?&]/.test(password)){
    return { valid : false, message: "Missing special character." };
  }

  return { valid: true }
}

function validatePhoneNumber(iti){

    const fullNumber = iti.getNumber().trim();

    if (!fullNumber) {
      return { valid: false, message: "Phone number is required." };
    }

    if (!iti.isValidNumber()) {
      return { valid: false, message: "Phone number is invalid." };
    }

    return { valid: true };
}

// live input event listener for the (confirm password)
function liveEventConfirmPass(){
  document.getElementById("confirmPass").addEventListener("input",function(){
    const password = document.getElementById("password").value;
    const confirmPass = this.value;

    const div = this.closest("div");
    const svg = div.querySelector("svg");
    const span = div.querySelector("span");

    if(password !== confirmPass){
      callErrorOnInput(this, svg, span, "Passwords do not match.");
    }else{
      span.textContent = "";
      if (svg) svg.style.display = "none";
      this.classList.remove("invalid");
    }
  });
}

function liveEventPhoneNumber(){
  document.getElementById("phoneNo").addEventListener("input", function (){

    const svg = document.getElementById("phoneNo-icon");
    const span = document.getElementById("phoneNo-error");

    this.classList.remove("invalid");
    if (svg) svg.style.display = "none";
    span.textContent = "";

  });
}



function callErrorOnInput(input, svg, span, message){
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

async function sendToBackend(userAccount){
  const registerURL = `http://localhost:8080/api/v1/auth/register`;
  const object = {
    method: "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(userAccount)
  }

  try{
       const result = await fetch(registerURL, object);
       const response = await result.json();


       // if valid logs the user in
       checkStatusCode(response.statusCode, response.message)


       console.log(response);
  }catch (errMsg){
    showServerErrorResponse(errMsg.message)
  }
}

// function to check status code
function checkStatusCode(statusCode, errorMsg){
  const validResponse = true;

  if(statusCode === 409){
    throw new Error(errorMsg);
  }

  if(statusCode === 400){
    throw new Error(errorMsg);
  }




  return validResponse;
}


function showServerErrorResponse(errorMsg){
  const errorContainer = document.getElementsByClassName("server-container-response")[0];
  const errorSpan= document.getElementById("server-error");
  errorSpan.textContent = errorMsg;
  errorContainer.style.display = "flex";
}


function clearServerError(){
  const errorContainer = document.getElementsByClassName("server-container-response")[0];
  const errorSpan= document.getElementById("server-error");
  errorSpan.textContent = "";
  errorContainer.style.display = "none";
}

