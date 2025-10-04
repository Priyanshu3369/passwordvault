"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VaultPanel from "@/components/VaultPanel";
import PasswordGenerator from "@/components/PasswordGenerator";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else setUser("Authenticated");
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">🔐 Password Vault Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        <PasswordGenerator />
        <VaultPanel />
      </div>
    </div>
  );
}
