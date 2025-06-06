import { API } from "../APIurl/api.js";
// global var
let tokenId = "";
let statusView = "";
let params = null;  // <- this is important


document.addEventListener("DOMContentLoaded", ()=>{

    getUrlParams(); // get url status (expired, invalid, verified)
    initViewModal();
    initResendBtn(); // CTA to resend-button
    initLoginBtn(); // CTA to redirect user to login page

});

function getUrlParams(){
    params = new URLSearchParams(window.location.search);
    statusView = params.get("status");
    console.log(`Status: ${statusView} \nTokenID: ${tokenId}`);
}

function initViewModal(){
    switch(statusView){
        case "expired":
            tokenId = params.get("tokenId");
            document.getElementById("expired-modal").classList.add("show");
            console.log(tokenId);
            break;
        case "verified":
            document.getElementById("verified-modal").classList.add("show");
            break;    

        case "invalid":
            document.getElementById("invalid-modal").classList.add("show");
            break;


    }
}


function initResendBtn(){
  document.getElementById("resend-btn").addEventListener("click", async function(e){

    e.preventDefault();

    const resendUrl = API.authentication.resendVerificationToken(tokenId); // Backend URL for resend email verification endpoint via user's emailTokenId
    const object = {
        method: "POST", 
        headers: {
        "Content-Type" :  "application/json"}
    };

    try{

        const response = await fetch(resendUrl, object);
        const result = await response.json();

        if(!response.ok){
            checkStatusCode(result.statusCode, result.message);
        }

        changeModal(result.data.email);

        console.log(response);
        console.log(result);


    }catch(err){
        console.log(err);
    }

  });
}

function changeModal(maskedEmail){
    // remove the previous show class
    document.getElementById("expired-modal").classList.remove("show");  

    // add the show class to the email-sent-succ div to show the modal 
    document.getElementById("email-sent-succesfully").classList.add("show");
    //set the p tag text  
    document.getElementById("email-sent-p").innerHTML= `A new verification link has been sent to <strong>${maskedEmail}</strong>.`;

}


function initLoginBtn(){
    document.getElementById("login-btn").addEventListener("click", function(e){
        e.preventDefault();
        window.location.replace("http://127.0.0.1:5500/pages/auth.html?authType=login");
    });
}