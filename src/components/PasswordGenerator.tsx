"use client";
import { useState } from "react";
import { generatePassword } from "@/lib/passwordGenerator";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    excludeSimilar: false,
  });
  const [password, setPassword] = useState("");

  const handleGenerate = () => {
    const pwd = generatePassword({ length, ...options });
    setPassword(pwd);
  };

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Password Generator</h2>

      {/* Length slider */}
      <label className="block mb-2">
        Length: {length}
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
      </label>

      {/* Options */}
      {Object.entries(options).map(([key, value]) => (
        <label key={key} className="block mb-2">
          <input
            type="checkbox"
            checked={value}
            onChange={() => setOptions({ ...options, [key]: !value })}
          />
          <span className="ml-2 capitalize">{key}</span>
        </label>
      ))}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600"
      >
        Generate
      </button>

      {/* Password Output */}
      {password && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded">
          <span className="font-mono">{password}</span>
          <button
            onClick={handleCopy}
            className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
