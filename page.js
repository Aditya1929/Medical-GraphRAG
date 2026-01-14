import Link from "next/link";
import SearchInterface from "@/components/SearchInterface";
import "./globals.css";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">

        <div className="text-center">
          <h1 className="text-hero">
            🔬 Medical Literature Search
          </h1>
        </div>

        <SearchInterface />
      </div>
    </main>
  );
}
