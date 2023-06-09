//ancora non è stato utilizzato
const isAuthored = (res, req, next) => {
    const {role} = req.body
    if (role !== 'admin') {
        return res.status(400).send({
            message : "Devi essere admin per fare questa azione"
        })
    }
    next()
}

export default isAuthored
