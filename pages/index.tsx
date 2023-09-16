import React, { useCallback, useState } from "react";
//@ts-ignore
import { useWebAuthn } from "react-hook-webauthn";

const rpOptions = {
  rpId: "localhost",
  rpName: "my super app",
};

function Index() {
  const [login, setLogin] = useState("");
  const [authResult, setAuthResult] = useState<string | null>(null);
  const { getCredential, getAssertion } = useWebAuthn(rpOptions);

  const onChangeLogin = useCallback((e: any) => {
    setLogin(e.target.value);
    setAuthResult(null);
  }, []);

  const onRegister = useCallback(async () => {
    try {
      const response = await fetch("/api/generateChallenge");
      const data = await response.json();
      const challenge = data.challenge;

      const credential = await getCredential({
        challenge,
        userDisplayName: login,
        userId: login,
        userName: login,
      });

      console.log(credential);
    } catch (error) {
      console.error("Error registering:", error);
    }
  }, [getCredential, login]);

  const onAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/generateChallenge");
      const data = await response.json();
      const challenge = data.challenge;

      const assertion = await getAssertion({ challenge });

      setAuthResult("Successfully authenticated!");
      console.log("Authentication successful!", assertion);
    } catch (error) {
      console.error("Error authenticating:", error);

      setAuthResult("Authentication failed.");
    }
  }, [getAssertion]);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          <div className="w-full">
            <input
              className="w-full px-4 py-2 rounded border focus:outline-none focus:border-blue-500 text-black"
              onInput={onChangeLogin}
              placeholder="User ID"
              type="text"
            />
          </div>
          <div className="w-full">
            <button
              className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={onRegister}
              type="button"
            >
              Register
            </button>
          </div>
          <div className="w-full">
            <button
              className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={onAuth}
              type="button"
            >
              Auth
            </button>
          </div>
          {}
          {authResult && (
            <div className="w-full text-center text-green-500 font-semibold">
              {authResult}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Index;
