import { userObject } from "../userDetailsRelated/userData.js";
import { sendToBackend } from "../controller/backendAPI.js";
import { clearServerError, clearErrorOnInput, showErrorOnInput } from "../utils/authCommon.js";

let iti;

function initSignUpJs(){
  initIntTelPhone();
  setSubmitSignUpBtn();
}



//************************************ PHONE NUMBER (INTTELPHONE RELATED) ************************************
function initIntTelPhone() {
  const phoneInput = document.getElementById("phoneNo");

  iti = window.intlTelInput(phoneInput, {
    initialCountry: "sg", // or auto
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });

}

//************************************ SIGN UP BUTTON INITIALIZATION ************************************
function setSubmitSignUpBtn() {
  const submitBtn = document.getElementById("signup-btn");
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    clearServerError();

    // const form = document.getElementsByClassName("input-fields-grid")[0];
    // const divs = form.querySelectorAll("div");

    // validate phone number using intltelphone library
    validatePhoneNumber();

    // get the divs of class input-group and iterate and do validation excluding the input-pass-group
    const inputGroupDiv = document.querySelectorAll(".input-group:not(.input-pass-group)");
    inputGroupDiv.forEach(div => {
      validateInputGroup(div);
    });

    // get the divs of class input-pass-group and iterate and do validation excluding the input--group
    const inputPassGroup = document.querySelectorAll(".input-pass-group");
    inputPassGroup.forEach(div => {
      validateInputPassGroup(div);
    });


    // if valid send the user credentials to the server
    if (!userObject.allValid) {
      console.log("Input Fields Signup Error! Unable to send to the backend server");
      return;
    }

    console.log(userObject.userAccount);
    console.log("Sending to backend...");
    sendToBackend();

  });

}



/************************************* ITERATIONS OF DIVS CLASSES *************************************/
// class: input-group
function validateInputGroup(div){
  const input = div.querySelector("input");

  switch(input.id){
    case "firstName":
      validateFieldText(div, validateFirstName, "firstName");
      break;

    case "lastName":
      validateFieldText(div, validateLastName, "lastName");
      break;

    case "email":
      validateFieldText(div, validateEmail, "email");
      break;

    // phone number is already checked since its inside of an inside div
    case "phoneNo":
      break; // we skip already been validated outside the forEach
  }
}

// class: input-pass-group
function validateInputPassGroup(div){
  const innerDivs = div.querySelectorAll(".input-with-icons");
  let result;

  innerDivs.forEach(innerDiv =>{
    const input = innerDiv.querySelector("input");
    const inputValue = input.value;

    switch (input.id) {

      case "password":
        const svg = document.getElementById("password-error-icon");
        const passwordErrorSpan = document.getElementById("password-error-span");
        result = validatePassword(input.value);

         if(!result.valid){
           showErrorOnInput(input, svg, passwordErrorSpan, result.message);
           userObject.allValid = false;
         }else{
           userObject.userAccount.password = inputValue;
         }
        clearErrorOnInput(input, svg, passwordErrorSpan);
        break;


      case "confirm-pass":
        const confirmPasswordErrorSpan = document.getElementById("confirm-pass-error-span");
        result = validateConfirmPassword(input.value);

        if(!result.valid){
          input.classList.add("invalid");
          confirmPasswordErrorSpan.textContent = result.message;
          userObject.allValid = false;
        }else{
          // clean up confirm pass
          input.classList.remove("invalid");
          confirmPasswordErrorSpan.textContent = "";
        }
        break;
    }

  });
}



//************************************ VALIDATION ******************************************************/

function validateFieldText(div, validatorFn, userKey) {
  const input = div.querySelector("input");
  const svg = div.querySelector(".error-icon");
  const span = div.querySelector(".error-message");

  const result = validatorFn(input.value);
  if(!result.valid){
    showErrorOnInput(input, svg, span, result.message);
    userObject.allValid = false;
  }else{
    userObject.userAccount[userKey] = input.value;
  }
  clearErrorOnInput(input, svg, span);
}

function validatePhoneNumber(){
  const phoneInput = document.getElementById("phoneNo");
  const phoneSvg = document.getElementById("phoneNo-icon")
  const phoneSpan = document.getElementById("phoneNo-error");

  const isValidNumber = iti.isValidNumber();
  const fullNumber = iti.getNumber().trim();

  if(!fullNumber){
    userObject.allValid = false;
    showErrorOnInput(phoneInput, phoneSvg, phoneSpan, "phone number is required");
    return;
  }

  if(!isValidNumber){
    userObject.allValid = false;
    showErrorOnInput(phoneInput, phoneSvg, phoneSpan, "Phone number is invalid");
    return;
  }

  console.log("PHONE NUMBER: VALID")
  userObject.userAccount.phoneNumber = fullNumber;
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

  console.log("FIRST NAME: VALID")
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

  console.log("LAST NAME: VALID")
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

  console.log("EMAIL: VALID")
  return { valid: true }
}

function validatePassword(passwordValue){
  //const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if(passwordValue === ""){
    return { valid : false, message: "Password is required." };
  }

  if(passwordValue.length < 8){
    return { valid : false, message: "Password length must be at least 8 characters." };
  }

  if(!/[A-Z]/.test(passwordValue)){
    return { valid : false, message: "Missing uppercase letter." };
  }

  if(!/[a-z]/.test(passwordValue)){
    return { valid : false, message: "Missing lowercase letter." };
  }

  if(!/\d/.test(passwordValue)){
    return { valid : false, message: "Must have at least one number." };
  }

  if(!/[@$!%*?&]/.test(passwordValue)){
    return { valid : false, message: "Missing special character." };
  }

  console.log("PASSWORD: VALID")
  return { valid: true }
}

function validateConfirmPassword(confirmPasswordValue){
  const password = document.getElementById("password").value.trim();
  if(password !== confirmPasswordValue) {
    return {valid: false, message: "Confirm password do not match."};
  }else if (confirmPasswordValue === ""){
    return {valid: false, message: "Confirm password is empty."};
  }else{
    console.log("CONFIRM PASSWORD: VALID");
    return { valid: true }
  }
}






































export{
    initSignUpJs,
    validateEmail, validatePassword
}