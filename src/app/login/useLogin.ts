import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(""); // Reset error state

    try {
      setIsSubmitting(true);
      const result = await signIn("app-password-login", {
        redirect: false,
        password: password,
      });

      if (result?.error) {
        setError("Invalid password. Please try again.");
        console.log("Login error:", result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Unexpected login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { password, setPassword, error, handleSubmit, isSubmitting };
};
