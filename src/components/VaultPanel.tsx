"use client";
import { useEffect, useState } from "react";
import { encryptData, decryptData } from "@/lib/crypto";

interface VaultItem {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export default function VaultPanel() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<VaultItem>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch vault items
  const fetchItems = async () => {
    const res = await fetch("/api/vault/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const decrypted = data.map((i: any) => ({
      ...i,
      title: decryptData(i.title),
      username: decryptData(i.username),
      password: decryptData(i.password),
      notes: decryptData(i.notes || ""),
      url: decryptData(i.url || ""),
    }));
    setItems(decrypted);
  };

  useEffect(() => {
    if (token) fetchItems();
  }, []);

  // Create or Update
  const handleSave = async () => {
    const encrypted = {
      title: encryptData(form.title),
      username: encryptData(form.username),
      password: encryptData(form.password),
      url: encryptData(form.url || ""),
      notes: encryptData(form.notes || ""),
    };

    const endpoint = editingId ? "/api/vault/update" : "/api/vault/create";
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...encrypted } : encrypted;

    await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    setForm({ title: "", username: "", password: "", url: "", notes: "" });
    setEditingId(null);
    fetchItems();
  };

  const handleEdit = (item: VaultItem) => {
    setForm(item);
    setEditingId(item._id || null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/vault/delete?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow p-6 rounded-xl w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Password Vault</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded col-span-1"
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2 rounded col-span-1"
        />
        <input
          type="text"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded col-span-1"
        />
        <input
          type="text"
          placeholder="URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="border p-2 rounded col-span-1"
        />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {editingId ? "Update Entry" : "Add Entry"}
      </button>

      {/* Vault List */}
      <div className="mt-6 space-y-2">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border p-3 rounded bg-gray-50"
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">{item.username}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id!)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No items found.</p>
        )}
      </div>
    </div>
  );
}
