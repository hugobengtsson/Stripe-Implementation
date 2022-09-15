export const makeRequest = async (url, body ) => {
    try {
        let response = await fetch(url, body)
        let result = await response.json();

        return result
    } catch(err) {
        console.error(err)
    }
}


export const checkUserInCookie = async() => {
    let result = await makeRequest('http://localhost:3000/api/login')
    return result
}


export const createUser = async(newCustomer) => {
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
    }
    let result = await makeRequest('http://localhost:3000/api/register', reqOptions)
    return result
}


export const loginUser = async(user) => {
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }
    let result = await makeRequest('http://localhost:3000/api/login', reqOptions)
    return result
}

export const logoutUser = async() => {

    const reqOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }
    let result = await makeRequest('http://localhost:3000/api/login', reqOptions)
    return result
}


export const getAllUsers = async() => {
    let result = await makeRequest('http://localhost:3000/api/users')
    return result
}