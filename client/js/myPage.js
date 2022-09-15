import { checkUserInCookie, createUser, loginUser, getAllUsers } from "../helpers/fetchHelper.js"
import validateValues from "../validation/validation.js"

const buttonCA = document.querySelector(".buttonCA")
const loginForm = document.querySelector("#login")
const createAccountForm = document.querySelector("#createAccount")

function initSite() {
    showCorrectAuthBoxes();
    setCounter();
}

// Switching between Login-form and create account-form
document.addEventListener("DOMContentLoaded", () => {

    // Clicking on the link - Login-form will appear and create account-form will dissapear
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("hidden");
        createAccountForm.classList.remove("hidden");
    });
    // Clicking on the link - create account-form will appear and Login-form will dissapear
    document.querySelector("#linkLogIn").addEventListener("click", e => {
        e.preventDefault();  
        loginForm.classList.remove("hidden");
        createAccountForm.classList.add("hidden");
    });
});

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
        const country = document.getElementById("country").value

        const newCustomer = {
            name: fullName,
            email,
            address: {
                line1: address,
                postal_code: zipcode,
                city,
                country,
            },
            phone,
        }

        let checkValues = validateValues(newCustomer, password)

        if(!checkValues.bool) {
            alert(checkValues.msg)
            return
        }

        const validPw = validPass(password, confPassword)
        const inputPwUser = sameInputs(fullName, password)

        if(!inputPwUser) {
            alert("Användarnamnet och lösenordet kan inte vara samma. Bättre kan du :) ")
            return
        }

        // If the password inputs doesnt match:
        if(!validPw){
            alert("Lösenorden stämmer inte överrens")
            return
        }
    
        const customer = {
            newCustomer,
            password
        }

        const registerCustomer = await createUser(customer)

        if(registerCustomer.bool) {
            alert(registerCustomer.msg)
            loginForm.classList.remove("hidden");
            createAccountForm.classList.add("hidden");
        } else {
            alert(registerCustomer.msg)
        }
    })
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
document.querySelector(".button").addEventListener("click", async (e) => {
    e.preventDefault()
    const inputEmail = document.getElementById("inputEmail").value
    const inputPassword = document.getElementById("inputPassword").value

        if(inputEmail.length > 0 && inputPassword.length > 0) {
                const login = await loginUser({email: inputEmail, password: inputPassword})

                if(!login.bool) {
                    alert(login.msg)
                    return
                }

                alert("Välkommen " + login.msg + "!") 
                showCorrectAuthBoxes();
        } else {
            alert("Alla fält måste vara ifyllda")
        }
})

// What will be shown if you're logged in or not
async function showCorrectAuthBoxes() {
    const checkuser = await checkUserInCookie();
    
    if(checkuser.msg.user) {
        window.location.href = './index.html';
    } 
}

function setCounter() {

    /* Update the counter */
    let counter = document.querySelector("#counter");
    let cart = JSON.parse(localStorage.getItem("cart"));
    let totalQuantity = 0

    if(cart) {
        for( let i=0; i < cart.length; i++ ) {
            totalQuantity = totalQuantity + cart[i].quantity
        }
    }
    counter.innerText = totalQuantity;
}

window.addEventListener("load", initSite);