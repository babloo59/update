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
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { FormError } from "./form-error";
import { login } from "@/actions/login";
import Link from "next/link";
import Captcha from "./captcha";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const { setIsLoggedIn } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    if (!isCaptchaValid) {
      setError("Please complete the CAPTCHA correctly before logging in.");
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    if (isLocked && lockoutTime) {
      const timeRemaining = (lockoutTime - Date.now()) / 1000;
      if (timeRemaining > 0) {
        toast.error(
          `Your account is locked. Please try again in ${Math.ceil(
            timeRemaining / 60
          )} minute(s).`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const res = await login(data);
      if (res?.error) {
        setFailedAttempts((prev) => prev + 1);

        if (failedAttempts + 1 >= 5) {
          const lockoutEndTime = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
          setLockoutTime(lockoutEndTime);
          setIsLocked(true);
          setError(
            "Your account has been locked due to too many failed login attempts. Please try again in 15 minutes."
          );
          toast.error(
            "Too many failed attempts. Account locked for 15 minutes."
          );
        } else {
          setError(res?.error);
          toast.error(res?.error);
        }
      } else {
        setIsLoggedIn(true);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const interval = setInterval(() => {
        const timeRemaining = lockoutTime - Date.now();
        if (timeRemaining <= 0) {
          clearInterval(interval);
          setFailedAttempts(0);
          setLockoutTime(null);
          setIsLocked(false);
          setError(null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutTime]);

  return (
    <CardWrapper
      headerLabel="Log in to your account"
      title="Login"
      backButtonHref="/register"
      backButtonLabel="Don't have an account? Register here."
      showSocial
    >
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Captcha Component */}
            <Captcha onVerify={(isValid) => setIsCaptchaValid(isValid)} />

            {/* Forgot Password Link */}
            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/forget-password">Forgot password?</Link>
            </Button>
          </div>

          {/* Error Message */}
          {error && <FormError message={error} />}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !isCaptchaValid || isLocked}
            style={{
              backgroundColor: isCaptchaValid && !isLocked ? "#28a745" : "#6c757d",
              cursor: isCaptchaValid && !isLocked ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Loading..." : isLocked ? "Account Locked" : "Login"}
          </Button>
        </form>
      </Form>

      <ToastContainer />
    </CardWrapper>
  );
};

export default LoginForm;
