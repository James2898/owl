"use client";

import * as React from "react";
import { useLogin } from "@/app/login/useLogin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === "authenticated") {
      // Redirect to the dashboard if the user is already authenticated
      router.push("/dashboard");
    }
  }, [router, status]);

  const { password, setPassword, error, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome, Teacher Farah
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please enter your app password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: "red" }}>
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
