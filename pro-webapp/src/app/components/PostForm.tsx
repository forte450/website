"use client";
import { useState } from "react";

export function PostForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }
      setTitle("");
      setContent("");
      onCreated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border rounded px-3 py-2 text-sm"
        placeholder="Optional content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-foreground text-background px-4 py-2 text-sm disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}

