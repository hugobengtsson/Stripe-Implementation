const makeRequest = async (url, body ) => {
    try {
        let response = await fetch(url, body)
        let result = await response.json();

        /* if(response.status != 200) {
            return false
        } */

        return result
    } catch(err) {
        console.error(err)
    }
}


export const checkUserInCookie = async() => {

    let result = await makeRequest('http://localhost:3000/api/login')

    if(result) {
        return result
    } 
    return false
}


export const createUser = async(newCustomer) => {

    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
    }

    let result = await makeRequest('http://localhost:3000/api/register', reqOptions)

    if(result) {
        return result
    } 
    return false
}


export const loginUser = async(user) => {

    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }

    let result = await makeRequest('http://localhost:3000/api/login', reqOptions)

    if(result) {
        return result
    } 
    return false
}

export const logoutUser = async() => {

    const reqOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    let result = await makeRequest('http://localhost:3000/api/login', reqOptions)

    if(result) {
        return result
    } 
    return false
}


