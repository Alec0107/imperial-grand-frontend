import { removeSpinner, showSpinner } from "../../components/reusable-buttons.js";
import { checkStatusCode, enableButton, disableButton, startCountdown } from "../utils/authCommon.js";
import { API } from "../APIurl/api.js";

// GLOBAL VAR
let resendButton; // resend

// AFTER SIGN UP AN EMAIL VERIFICATION MODAL WITH 
// TIMER MUST BE SHOWN AND SUBMIT RESEND EMAIL VERIF (WHEN SERVER RESPONSE EMAIL NOT VERIFED)
export function submitResendVerification(email){
  resendButton = document.getElementById("resend-btn");

  resendButton.addEventListener("click", async function(e){
    e.preventDefault();
      const resendUrl = API.authentication.resendVerificationEmail(email); // Backend URL for resend email verification endpoint via user's email
      const object = {
        method: "POST", // 👈 now it's correct
        headers: {
          "Content-Type" :  "application/json"}
      };

      
      const spinner = resendButton.querySelector(".spin-loader");
      const spanBtnLabel = resendButton.querySelector(".btn-text");
      showSpinner(spinner, spanBtnLabel, "Sending link...");

      console.log(resendUrl);
      console.log(object);
      try {
        const response = await fetch(resendUrl, object);
        const result = await response.json();

        if(!response.ok){
          checkStatusCode(result.statusCode, result.message);
        }

        console.log(result);
        
        // show the div timer-container
        document.querySelector(".timer-container").classList.remove("hidden"); 

        // show info msg (e.g., email has been sent successfully )
        showInfoMsg(`A verification email has been sent to <strong>${email}.</strong> Please check your inbox.`)

        disableButton(resendButton); // disable the resend button based on timer
        startCountdown(result.data.expiryTime);  // show timer

      }catch (err){
        // show a modal or dialog that indicates resend req was failed or too many attempts
        console.log(err)
        showInfoMsg(err.message);
        
      }finally{
       removeSpinner(spinner, spanBtnLabel, "Resend Verification");
      }

  });
}

export function showInfoMsg(innerHTMLPTag){
    // show a message that the email was sent successfully
    const infoMsg = document.createElement("p");
    infoMsg.classList.add("font-ui");
    infoMsg.innerHTML = innerHTMLPTag;
         // Before appending iterate the error div if it has the p tag alr if so remove
    const infoMsgDiv = document.querySelector(".info-msg");
    infoMsgDiv.querySelectorAll("p").forEach(p => p.remove());

    // appending the p tag inside the div
    infoMsgDiv.appendChild(infoMsg);
}


