// A global error handling middleware for Express.js applications
const errorHandler = (err, req, res, next) => {
    if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
    }

    // MongoDB duplicate key error
    if (err?.code == 11000) {
        const field = Object.keys(err.keyValue)[0];
        const field1 = field == "email" ? "User" : field;
        return res.status(409).json({ error: `${field1} already exists` });
    }

    // Mongoose validation error
    if (err.name == "ValidationError") {
        const messages = Object.values(err.errors).map(errItem => errItem.message);
        return res.status(400).json({ error: messages[0] });
    }

    // Default to 500 server error
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });

}
export default errorHandler;



// AGR HAMNE KAHA USERNAME OR EMAIL UNIQ HOGE LEKIN USER NE DONON  dubara seme send kya  to mongodb erro dega


// err kch asa hoga tab
// const err = {
//     code:11000,
//     keyValue:{
//         useranme:"abc",
//         email:"abc@gmail.com"
//     }
// errors:{
//     email:{message:"email is not valid"},
//     gnder:"onlye allowed male female other only"
// }
// }

// Object.keys ka kam ye he
// Object.keys(err.keyValue) ==> ["username","email"]