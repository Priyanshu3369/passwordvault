import CryptoJS from "crypto-js";

const SECRET_KEY = "vault-secret-key"; // in real app derive from user password

export const encryptData = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptData = (cipher: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
