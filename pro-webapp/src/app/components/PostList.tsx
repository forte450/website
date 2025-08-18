"use client";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
};

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data: Post[] = await res.json();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent Posts</h2>
        <button onClick={load} className="text-sm underline">Refresh</button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts yet.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="border rounded p-3">
              <div className="text-sm font-medium">{p.title}</div>
              {p.content && (
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{p.content}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

