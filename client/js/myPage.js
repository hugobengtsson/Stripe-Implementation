import { checkUserInCookie, createUser, loginUser, getAllUsers } from "../helpers/fetchHelper.js"

const buttonCA = document.querySelector(".buttonCA")
const loginForm = document.querySelector("#login")
const createAccountForm = document.querySelector("#createAccount")


// Shoppingcart counter not implemented yet.


// Switching between Login-form and create account-form
document.addEventListener("DOMContentLoaded", () => {

    // Clicking on the link - Login-form will appear and create account-form will dissapear
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault(); // e will prevent us going back to startpage when clicking on button
        loginForm.classList.add("hidden");
        createAccountForm.classList.remove("hidden");
    });
    // Clicking on the link - create account-form will appear and Login-form will dissapear
    document.querySelector("#linkLogIn").addEventListener("click", e => {
        e.preventDefault();  // e will prevent us going back to startpage when clicking on button
        loginForm.classList.remove("hidden");
        createAccountForm.classList.add("hidden");
    });
});


// Create account - process


// Create account/customer
if(buttonCA) {
    buttonCA.addEventListener("click", async (e) => {
        e.preventDefault(); 
    
        const fullName = document.getElementById("name").value
        const password = document.getElementById("pw").value
        const confPassword = document.getElementById("confirmPw").value
        const email = document.getElementById("email").value
        const address = document.getElementById("address").value
        const zipcode = document.getElementById("zipcode").value
        const city = document.getElementById("city").value
        const phone = document.getElementById("phone").value

        const newCustomer = {
            name: fullName,
            email,
            address,
            zipcode,
            city,
            phone,
            password
        }

        if(
            phone.length == 0 || 
            fullName.length == 0 || 
            confPassword.length == 0 || 
            email.length == 0 || 
            address.length == 0 || 
            zipcode.length == 0 || 
            city.length == 0) 
        {
            alert("Fyll i alla fält!")
            return
        }


    //// Todo: Fix validation. Make a check if input is an email address //// 

        //const isValid = validateInputs(fullName, password)
        const validPw = validPass(password, confPassword)
        const inputPwUser = sameInputs(fullName, password)
        let usernameisfree = true
    
        const userList = await getAllUsers()
    
        // if the "isValid"-function is false (See the function below)
        /* if(!isValid) {
            alert("Du behöver ha fler än 5 tecken")
            return
        } */
        
        if(!inputPwUser) {
            alert("Användarnamnet och lösenordet kan inte vara samma. Bättre kan du :) ")
            return
        }
        
        // Comparing if the username you want to create already exists in the list
        for(let i = 0 ; i < userList.length; i++) {
            
            let user = userList[i]
            
            if(user.email == email) {
    
                usernameisfree = false
    
                if(!usernameisfree) {
                    alert("Användaren existerar redan!")
                    return
                }
            }
        }   
    
        // If the password inputs doesnt match:
        if(!validPw){
            alert("Lösenorden stämmer inte överrens")
            return
        }
    
        const registerCustomer = createUser(newCustomer)

        if(registerCustomer) {
            alert("Ditt konto är skapat! Nu kan du logga in")
            loginForm.classList.remove("hidden");
            createAccountForm.classList.add("hidden");
        }
    })
}


// Checking if the inputs have more than 4 characters     
function validateInputs(username, password) {
    if(username.length >= 6 && password.length >= 6){
        return true
    }
        return false
}

// Checking if the input of passwords are correct
function validPass(password, confPassword){

    if(password == confPassword) {
        return true
    }
    return false
}
// Checking if username and password are the same
function sameInputs(username, password){
    if(username == password) {
        return false
    }
    return true
}



// Login - process


// Function for clicking on the "logga in"-button
document.querySelector(".button").addEventListener("click", async (e) => {
    
    const inputEmail = document.getElementById("inputEmail").value
    const inputPassword = document.getElementById("inputPassword").value

        if(inputEmail.length > 0 && inputPassword.length > 0) {
                const login = await loginUser({email: inputEmail, password: inputPassword})
    
                if(!login) {
                    alert(login)
                    return
                }
    
                alert(login) 
                showCorrectAuthBoxes();
        } else {
            alert("Alla fält måste vara ifyllda")
        }
})

// What will be shown if you're logged in or not
async function showCorrectAuthBoxes() {
    const checkuser = await checkUserInCookie();

    if(checkuser.user) {
        window.location.href = './index.html';
        return
    } 
}


window.addEventListener("load", showCorrectAuthBoxes);