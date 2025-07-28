"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-600">
      <h2 className="text-2xl font-bold mb-4">Login Error</h2>
      <p>{error.message}</p>
    </div>
  );
}