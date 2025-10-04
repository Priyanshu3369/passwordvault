// src/lib/passwordGenerator.ts

export interface GeneratorOptions {
  length: number;
  numbers: boolean;
  symbols: boolean;
  lowercase: boolean;
  uppercase: boolean;
  excludeSimilar: boolean;
}

export function generatePassword({
  length,
  numbers,
  symbols,
  lowercase,
  uppercase,
  excludeSimilar,
}: GeneratorOptions): string {
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()-_=+[]{};:,.<>?";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const similarChars = "ilLIoO0";

  let chars = "";
  if (numbers) chars += numberChars;
  if (symbols) chars += symbolChars;
  if (lowercase) chars += lowerChars;
  if (uppercase) chars += upperChars;

  if (!chars) return "";

  // Exclude similar looking characters
  if (excludeSimilar) {
    chars = chars
      .split("")
      .filter((c) => !similarChars.includes(c))
      .join("");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}
