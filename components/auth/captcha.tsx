"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);

  // Generate a new CAPTCHA
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaCode = "";
    for (let i = 0; i < 6; i++) {
      captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaCode);
    setErrorMessage(""); // Clear previous error
  };

  useEffect(() => {
    generateCaptcha();

    // Load lockout state and attempts from localStorage
    const savedAttempts = parseInt(localStorage.getItem("captchaAttempts") || "0", 10);
    const savedLockEndTime = parseInt(localStorage.getItem("captchaLockEndTime") || "0", 10);

    if (savedLockEndTime && savedLockEndTime > Date.now()) {
      setIsLocked(true);
      setLockEndTime(savedLockEndTime);
    }

    setAttempts(savedAttempts);
  }, []);

  // Lock user for 15 minutes
  const lockUser = () => {
    const lockDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    const lockEndTime = Date.now() + lockDuration;

    setIsLocked(true);
    setLockEndTime(lockEndTime);

    // Save lockout state to localStorage
    localStorage.setItem("captchaLockEndTime", lockEndTime.toString());

    setTimeout(() => {
      setIsLocked(false);
      setAttempts(0); // Reset attempts after 15 minutes
      setLockEndTime(null);
      setErrorMessage("");

      // Clear lockout state from localStorage
      localStorage.removeItem("captchaAttempts");
      localStorage.removeItem("captchaLockEndTime");
    }, lockDuration);
  };

  // Validate CAPTCHA input
  const validateCaptcha = () => {
    if (isLocked) {
      const remainingTime = Math.ceil((lockEndTime! - Date.now()) / 1000 / 60); // Time left in minutes
      setErrorMessage(`Too many attempts. Try again after ${remainingTime} minute(s).`);
      return;
    }

    const isValid = captchaInput === captcha;
    if (isValid) {
      onVerify(true); // Notify parent component
      setErrorMessage("CAPTCHA verified successfully!");
      setAttempts(0); // Reset attempts on success
      localStorage.removeItem("captchaAttempts"); // Clear saved attempts
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Save updated attempts count to localStorage
      localStorage.setItem("captchaAttempts", newAttempts.toString());

      if (newAttempts >= 5) {
        setErrorMessage("Too many attempts. Try again after 15 minutes.");
        lockUser();
      } else {
        setErrorMessage(`Incorrect CAPTCHA. You have ${5 - newAttempts} attempts left.`);
        generateCaptcha();
      }
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      validateCaptcha();
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {captcha}
        </div>
        <Button onClick={generateCaptcha} disabled={isLocked}>
          ↻
        </Button>
      </div>
      <input
        type="text"
        value={captchaInput}
        onChange={(e) => setCaptchaInput(e.target.value)}
        placeholder="Enter CAPTCHA"
        onKeyDown={handleKeyDown}
        disabled={isLocked}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "10px",
          backgroundColor: isLocked ? "#e0e0e0" : "white",
        }}
      />
      <Button onClick={validateCaptcha} disabled={isLocked}>
        Verify CAPTCHA
      </Button>
      {errorMessage && (
        <div style={{ color: isLocked ? "red" : "orange", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default Captcha;
