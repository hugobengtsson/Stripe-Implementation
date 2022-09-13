import { checkUserInCookie, createUser, loginUser } from "./helpers/fetchHelper.js"

const logOut = document.querySelector(".logout")
const myPage = document.querySelector(".myPage")
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


// Creates a function when you click on "Skapa konto"-button  

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

        ////////////////////////////////////
        const newCustomer = {
            name: fullName,
            email,
            address,
            zipcode,
            city,
            phone,
            password
        }

        console.log(newCustomer)

        ///////////////////////

    //// Todo: Fix validations. Below is old !! //// 

        const isValid = validateInputs(fullName, password)
        const validPw = validPass(password, confPassword)
        const inputPwUser = sameInputs(fullName, password)
        let usernameisfree = true
    
        // Fetching the userlist from local storage
    //    // Todo: Fetch userlist from server/strip instead
        let userList = localStorage.getItem("users")
    
        // if the "isValid"-function is false (See the function below)
        if(!isValid) {
            alert("Du behöver ha fler än 5 tecken")
            return
        }
        
        if(!inputPwUser) {
            alert("Användarnamnet och lösenordet kan inte vara samma. Bättre kan du :) ")
            return
        }
    
        // If something is in the userlist, do a parse. Else, leave it empty. 
        if(userList) {
            userList = JSON.parse(userList)
        } else {
            userList = []
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
    
        
    //  // Todo: Make a post to customer(stripe)
        // If you get through the validation the credentials will be pushed to the userlist
        userList.push(newCustomer) // Denna behövs inte sen

        const registerCustomer = createUser(newCustomer)

        if(registerCustomer) {
            alert("Ditt konto är skapat! Nu kan du logga in")
            loginForm.classList.remove("hidden");
            createAccountForm.classList.add("hidden");
            
            // Updates the list in local storage
        //  // Shall not be used after cookie session is implemented    
            localStorage.setItem("users", JSON.stringify(userList))
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

    //fetching theuserlist from local storage
//  // Todo: Fetch from server/stripe instead    


    //const checkuser = checkUserInCookie();
    //console.log(checkuser)

////////////

    // GetAllUsers

    let userList = localStorage.getItem("users")

    if(userList) {
        userList = JSON.parse(userList)
    } else {
        userList = []
    }

    // compare the lists. The match will return
    let logInUser = userList.find((user) => {

        return (user.email == inputEmail && user.password == inputPassword)
    })

    // If we get a match, we push the match to the new list "loggedInUser". If not, we have the wrong credentials
    if(logInUser) {

        let loggedInUser = inputEmail
    //  // Shall not be used after cookie session is implemented  (localstorage)

        const login = await loginUser({email: logInUser.email, password: logInUser.password})

        console.log(login)

        localStorage.setItem("loggedInUser", loggedInUser);
        alert("Du är inloggad!"  + " Välkommen " + logInUser.name + "!" ) 
        
        showCorrectAuthBoxes();
        return
    } 
    else {
        alert("Fel användarnamn eller lösenord")
    }
})

// What will be shown if you're logged in or not
async function showCorrectAuthBoxes() {

    const checkuser = await checkUserInCookie();
    //console.log(checkuser)

    //  // Todo:  Shall not be used after cookie session is implemented  . Check cookie instead.
    //let loggedInUser = localStorage.getItem("loggedInUser")

    if(checkuser.user) {
        window.location.href = './index.html';
        return
    } 
        //loggedInUser = []
}


window.addEventListener("load", showCorrectAuthBoxes);