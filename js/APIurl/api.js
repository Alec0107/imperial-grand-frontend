
const LOCALHOST_BASE_URL = "http://localhost:8080";

export const API = {
    authentication: {
        login: `${LOCALHOST_BASE_URL}/api/v1/auth/login`,
        register: `${LOCALHOST_BASE_URL}/api/v1/auth/register`,
        resendVerificationEmail: (email) => { return`${LOCALHOST_BASE_URL}/api/v1/auth/resend-verification?email=${email}`},
        resendVerificationToken: (tokenId) => {return`${LOCALHOST_BASE_URL}/api/v1/auth/inbox-resend-verification?tokenId=${tokenId}`},
        forgotPassword: `${LOCALHOST_BASE_URL}/api/v1/auth/forgot-password`,
        resetPassword: `${LOCALHOST_BASE_URL}/api/v1/auth/reset-password`,
        validateResetToken: (token, tokenId) => { return `${LOCALHOST_BASE_URL}/api/v1/auth/reset-password/validate?token=${token}&tokenId=${tokenId}`},
        refreshToken: `${LOCALHOST_BASE_URL}/api/v1/auth/refresh-token`
    },
    reservations: {
        /**
         *  TODO: 
         **/
    }, 
    contactUs: {
        sendMsg: `${LOCALHOST_BASE_URL}/api/v1/contact`
    },
    user: {
        profile: `${LOCALHOST_BASE_URL}/api/v1/auth/profile`
        /**
         *  TODO: 
         **/
    }


}

export function getDeviceIdFromCookie(){
    const prefix = `device-id=`
    const cookies = document.cookie.split(";");

    for(let cookie of cookies){
        cookie = cookie.trim();
        if(cookie.startsWith(prefix)){
            console.log("hi")
            console.log(cookie.substring(prefix.length));
            return cookie.substring(prefix.length);
        }
    }
    return null;
}


export async function authApi(url, options = {}) {
    const defaultOptions = {
        credentials: `include`,
        ...options
    };

    console.log("Executing original request...");
    console.log(defaultOptions);
    let response = await fetch (url, defaultOptions);

    if(!response.ok && response.status === 401){
        console.log("Executing refresh request...");
        const refreshResponse = await fetch(API.authentication.refreshToken,{
            method: `POST`,
            credentials: `include`,
            headers: {
                "Content-type" : "application/json",
                "x-device-id" : getDeviceIdFromCookie()
            }
        });
 
        if(refreshResponse.ok){
            // retry the original request
            console.log("Fething original request...")
            response = await fetch (url, defaultOptions);
        }else{
            console.log("signup redirect");
            window.location.replace("../../pages/authentication/auth.html?authType=signup");
        }
    }

    return response;
}