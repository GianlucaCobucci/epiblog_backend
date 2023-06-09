import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.header("auth")

    if (!token) {
        return res.status(401).send({
            errorType: "Token non presente",
            statusCode: 401,
            message: "Per usare questo endpoint serve un token di accesso"
        })
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_JWT_KEY)
        req.user = verified
        next()
    } catch (error) {
        res.status(403).send({
            errorType: "Token error",
            statusCode: 403,
            message: "Token non valido o scaduto"
        }) 
    }
}

export default verifyToken