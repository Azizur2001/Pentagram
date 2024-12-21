"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/firebaseAuth";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      alert("Logged in successfully!");
      router.push("/"); // Navigate to Home page after login
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to login. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="logo-container flex flex-col items-center mt-4 mb-6">
        <Image
          src="/camera-logo.png"
          alt="Camera Logo"
          width={64} // Explicit width
          height={64} // Explicit height
          className="mb-2"
        />

        <h1 className="text-5xl font-bold text-white">Pentagram</h1>
      </div>
      <div className="wrapper">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <p className="form-login">Login</p>

          {/* Email Input */}
          <div className="input-box">
            <input
              required
              placeholder="Username"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="input-box">
            <input
              required
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password</a>
          </div>

          <button
            className="btn flex items-center justify-center"
            type="submit"
          >
            Login
          </button>

          <div className="register-link">
            <p>
              Dont have an account?{" "}
              <a onClick={() => router.push("/signup")}>Register</a>
            </p>
          </div>
        </form>

        {/* CSS */}
        <style jsx>{`
          .wrapper {
            width: 420px;
            background: rgb(2, 0, 36);
            background: linear-gradient(
              90deg,
              rgba(2, 0, 36, 1) 9%,
              rgba(9, 9, 121, 1) 68%,
              rgba(0, 91, 255, 1) 97%
            );
            backdrop-filter: blur(9px);
            color: #fff;
            border-radius: 12px;
            padding: 30px 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .form-login {
            font-size: 36px;
            text-align: center;
          }

          .wrapper .input-box {
            position: relative;
            width: 100%;
            height: 50px;
            margin: 30px 0;
          }

          .input-box input {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 40px;
            font-size: 16px;
            color: #fff;
            padding: 20px 45px 20px 20px;
          }

          .input-box input::placeholder {
            color: #fff;
          }

          .wrapper .remember-forgot {
            display: flex;
            justify-content: space-between;
            font-size: 14.5px;
            margin: -15px 0 15px;
          }

          .remember-forgot label input {
            accent-color: #fff;
            margin-right: 3px;
          }

          .remember-forgot a {
            color: #fff;
            text-decoration: none;
          }

          .remember-forgot a:hover {
            text-decoration: underline;
          }

          .wrapper .btn {
            width: 150px;
            height: 45px;
            background: #fff;
            border: none;
            outline: none;
            border-radius: 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            font-size: 16px;
            color: #333;
            font-weight: 600;
            margin: 10px auto 0;
            align-items: center;
            justify-content: center;
          }

          .wrapper .register-link {
            font-size: 14.5px;
            text-align: center;
            margin: 20px 0 15px;
          }

          .register-link p a {
            color: #fff;
            text-decoration: none;
            font-weight: 600;
          }

          .register-link p a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
}
