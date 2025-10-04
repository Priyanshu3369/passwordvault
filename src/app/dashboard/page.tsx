"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordGenerator from "@/components/PasswordGenerator";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setUser("Authenticated User");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <PasswordGenerator />
    </div>
  );
}
