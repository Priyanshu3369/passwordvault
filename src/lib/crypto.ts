import CryptoJS from "crypto-js";

// In real apps: derive from user password, here we use a static for demo
const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || "defaultsecret";

export function encrypt(text: string) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
