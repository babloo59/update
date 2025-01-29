"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { register } from "@/actions/register";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import Captcha from "./captcha";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const { setIsLoggedIn } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    if (!isCaptchaValid) {
      setError("Please complete the CAPTCHA correctly before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await register(data);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(res.success);
        setIsLoggedIn(true);
        router.push("/dashboard");
      }
    } catch (e) {
      console.error("Registration failed:", e);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch (e) {
      console.error("Google Sign-In failed:", e);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      title="Register"
      backButtonHref="/sign-in"
      backButtonLabel="Already have an account? Sign in"
      showSocial={false} // Customizing CardWrapper prop
    >
      <div className="space-y-4">
        {/* Google Sign-In */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className={`w-full px-6 py-3 rounded-lg ${
              googleLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition`}
          >
            {googleLoading ? "Signing in..." : "Sign Up with Google"}
          </button>
          <span className="text-gray-500">or</span>
        </div>

        {/* Traditional Registration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="johndoe@email.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CAPTCHA */}
              {/* <Captcha onVerify={(isValid) => setIsCaptchaValid(isValid)} /> */}
            </div>

            {/* Success Message */}
            {success && <FormSuccess message={success} />}
            {/* Error Message */}
            {error && <FormError message={error} />}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isCaptchaValid}
              style={{
                backgroundColor: isCaptchaValid ? "#28a745" : "#6c757d",
                cursor: isCaptchaValid ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Loading..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </CardWrapper>
  );
};

export default RegisterForm;
