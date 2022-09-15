import { checkUserInCookie, createUser, loginUser, getAllUsers } from "../helpers/fetchHelper.js"

const buttonCA = document.querySelector(".buttonCA")
const loginForm = document.querySelector("#login")
const createAccountForm = document.querySelector("#createAccount")
let inputEmail = document.getElementById("inputEmail").value

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
            address,
            zipcode,
            city,
            country,
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
            country.length == 0 || 
            city.length == 0) 
        {
            alert("Fyll i alla fält!")
            return
        }

        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            alert(" Email - Fel format")
            return
        }
        if(country == "Sverige" && zipcode.length != 5 || /^[0-9]+$/.test(zipcode) == false) {
            alert("Postkod - Måste innehålla 5 siffror")
            return
        }
        if(country == "Norge" && zipcode.length != 4 || /^[0-9]+$/.test(zipcode) == false) {
            alert("Postkod - Måste innehålla 4 siffror")
            return
        }
        if(phone.length != 10 || /^[0-9]+$/.test(phone) == false) {
            alert("Telefonnummer -  Måste innehålla 10 siffror. Ex. 0721112233")
            return
        }
        if(confPassword.length < 6) {
            alert("Lösenord - Måste innehålla minst 6 karaktärer")
            return
        }
        if(fullName.length < 3 ) {
            alert("Namn - Måste innehålla minst 2 bokstäver")
            return 
        } 
        if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(fullName) == false){
            alert("Namn - Får endast innehålla bokstäver")
            return 
        }
        if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(city) == false){
            alert("Ort - Får endast innehålla bokstäver")
            return 
        }
        if(city.length < 3) {
            alert("Ort - Måste innehålla minst 2 bokstäver")
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
    
        const registerCustomer = await createUser(newCustomer)

        if(registerCustomer.bool) {
            alert(registerCustomer.msg)
            loginForm.classList.remove("hidden");
            createAccountForm.classList.add("hidden");
            inputEmail = email // Kolla om denna funkar
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

                alert(login.msg) 
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
        return
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