import Link from "next/link";

export default function Home() {
  return (
    <div className="items-center justify-center font-sans">
      <main className="flex flex-col items-center justify-center py-32 px-16">
        <div>Hello, this is RED</div>
        <h1>Who are you</h1>

        <Link href="/blog">
          <button className="border border-red-500 rounded-xl p-4 mt-5">Click to go at blog page</button>
        </Link>
      </main>
    </div>
  );
}
