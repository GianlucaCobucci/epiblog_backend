//middleware non globali, usati per alcune rotte. Se la inserissi in server.js, metto il middleware a tutte le rotte

const logger = (req, res, next) => {
    const {url, ip, method} = req
    console.log(`In data ${new Date().toISOString()} effettuata richiesta ${method} all'endpoint ${url} da indirizzo ip ${ip}`)
    next()
}

export default logger