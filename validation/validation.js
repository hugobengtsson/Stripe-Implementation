
const validateValues = (object) => {

    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(object.email)) {
        return {bool: false, msg: "Email - Fel format" }
    }
    if(object.country == "Sverige" && object.zipcode.length != 5 || /^[0-9]+$/.test(object.zipcode) == false) {
        return {bool: false, msg: "Postkod - Måste innehålla 5 siffror"}
    }
    if(object.country == "Norge" && object.zipcode.length != 4 || /^[0-9]+$/.test(object.zipcode) == false) {
        return {bool: false, msg: "Postkod - Måste innehålla 4 siffror"}
    }
    if(object.phone.length != 10 || /^[0-9]+$/.test(object.phone) == false) {
        return {bool: false, msg: "Telefonnummer -  Måste innehålla 10 siffror. Ex. 0721112233"}
    }
    if(object.password.length < 6) {
        return {bool: false, msg: "Lösenord - Måste innehålla minst 6 karaktärer"}
    }
    if(object.name.length < 3 ) {
        return {bool: false, msg: "Namn - Måste innehålla minst 2 bokstäver"}
    } 
    if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(object.name) == false){
        return {bool: false, msg: "Namn - Får endast innehålla bokstäver"}
    }
    if(/^[A-Za-z\s\u00C0-\u00ff_-]*$/.test(object.city) == false){
        return {bool: false, msg: "Ort - Får endast innehålla bokstäver"}
    }
    if(object.city.length < 3) {
        return {bool: false, msg: "Ort - Måste innehålla minst 2 bokstäver"}
    }

    return {bool: true, msg: "Pass!"}
}

export default validateValues
