import CryptoJS from "crypto-js"

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET

export const encryptData = (data) => {
    const stringData = JSON.stringify(data)
    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString()
}

export const decryptData = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
        return JSON.parse(decryptedData)
    } catch {
        return null
    }
}
