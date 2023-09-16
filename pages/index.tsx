import Link from "next/link";

export default function Home() {
  return (
    <div className="text-4xl">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold text-center mt-8">Web Authn</h1>
        <Link href="/register">
          <p className="text-blue-500 hover:text-blue-700">Register</p>
        </Link>

        <Link href="/login">
          <p className="text-blue-500 hover:text-blue-700">Login</p>
        </Link>
      </main>
    </div>
  );
}
