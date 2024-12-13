const crypto = require("crypto")

export function hashPassword(password, email) {
    return crypto.pbkdf2Sync(password, email, 10000, 64, 'sha512').toString('hex')
}
export function validPassword(password, email, hash) {
    const checkHash = crypto.pbkdf2Sync(password, email, 10000, 64, 'sha512').toString('hex')
    console.log("For password : ",password," => ",checkHash, " =?= ", hash)
    return hash === checkHash
}