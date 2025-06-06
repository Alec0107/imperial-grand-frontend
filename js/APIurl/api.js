const LOCALHOST_BASE_URL = "http://localhost:8080";

export const API = {
    authentication: {
        login: `${LOCALHOST_BASE_URL}/api/v1/auth/login`,
        register: `${LOCALHOST_BASE_URL}/api/v1/auth/register`,
        resendVerificationEmail: (email) => { return`${LOCALHOST_BASE_URL}/api/v1/auth/resend-verification?email=${email}`},
        resendVerificationToken: (tokenId) => {return`${LOCALHOST_BASE_URL}/api/v1/auth/inbox-resend-verification?tokenId=${tokenId}`},
        forgotPassword: `${LOCALHOST_BASE_URL}/api/v1/auth/forgot-password`,
        resetPassword: `${LOCALHOST_BASE_URL}/api/v1/auth/reset-password`,
        validateResetToken: (token, tokenId) => { return `${LOCALHOST_BASE_URL}/api/v1/auth/reset-password/validate?token=${token}&tokenId=${tokenId}`}
    },
    reservations: {
        /**
         *  TODO: 
         **/
    }, 
    user: {
        /**
         *  TODO: 
         **/
    }


}