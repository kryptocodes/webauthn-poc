import { FormEvent, useEffect, useState } from "react";
import { supported, create, get } from "@github/webauthn-json";
import { withIronSessionSsr } from "iron-session/next";
import { generateChallenge, isLoggedIn } from "../lib/auth";
import { sessionOptions } from "../lib/session";
import { useRouter } from "next/router";

export default function Login({ challenge }: { challenge: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsAvailable(available && supported());
    };

    checkAvailability();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const credential = await get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        rpId: "localhost",
      },
    });

    const result = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, credential }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) {
      router.push("/admin");
    } else {
      const { message } = await result.json();
      setError(message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-8">Login</h1>
      {isAvailable ? (
        <form
          className="mt-6 max-w-md mx-auto"
          method="POST"
          onSubmit={onSubmit}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          {error != null ? (
            <pre className="mt-4 text-red-500">{error}</pre>
          ) : null}
        </form>
      ) : (
        <p className="mt-6 text-center text-red-500">
          Sorry, webauthn is not available.
        </p>
      )}
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  if (isLoggedIn(req)) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const challenge = generateChallenge();
  req.session.challenge = challenge;
  await req.session.save();

  return { props: { challenge } };
},
sessionOptions);
