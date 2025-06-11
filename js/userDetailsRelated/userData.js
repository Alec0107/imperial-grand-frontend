const userObject = { 
  allValid: true,
  userAccount : {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dob: ""
  }
}

const userObjectLogin = {
  allValid: true,
  userAccount : {
    email: "",
    password: "",
    rememberMe: false
  }
}


function resetUserObjectSignUp(){
  userObject.allValid = true;
  userObject.userAccount = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  };
}

function resetUserObjectLogin(){
  userObjectLogin.allValid = true;
  userObjectLogin.userAccount = {
    email: "",
    password: ""
  }
}

export {
  userObject,
  userObjectLogin, 
  resetUserObjectSignUp,
  resetUserObjectLogin
};
