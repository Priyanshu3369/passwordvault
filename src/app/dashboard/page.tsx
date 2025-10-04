"use client";
import { useState } from "react";
import { encryptData, decryptData } from "@/lib/crypto";

export default function DashboardPage() {
  const [status, setStatus] = useState("");

  const handleTestVault = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    const encrypted = encryptData("mySuperSecret123!");

    const res = await fetch("/api/vault/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "GitHub",
        username: "priyanshu",
        password: encrypted,
        url: "https://github.com",
        notes: encryptData("Personal account"),
      }),
    });

    const data = await res.json();
    setStatus(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Vault Backend Test 🔐</h1>
      <button
        onClick={handleTestVault}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Encrypted Vault Item
      </button>
      {status && (
        <pre className="mt-4 bg-gray-200 p-4 rounded text-sm">{status}</pre>
      )}
    </div>
  );
}
