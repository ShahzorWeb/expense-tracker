"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import InputField from "@/components/InputField";

interface SettingsFormProps {
  initialName: string;
  email: string;
}

export default function SettingsForm({ initialName, email }: SettingsFormProps) {
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

   setSaving(false);
    if (res.ok) {
      await update({ name });
      setMessage("Saved successfully!");
    } else {
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 max-w-md"
    >
      <InputField
        label="Name"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
        />
        <p className="text-xs text-neutral-600 mt-1">Email cannot be changed.</p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("wrong") ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
