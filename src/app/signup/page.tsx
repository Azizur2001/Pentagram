// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { registerWithEmail } from "@/lib/firebaseAuth";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleRegister = async () => {
//     try {
//       await registerWithEmail(email, password);
//       alert("Registered successfully!");
//       router.push("/login"); // Navigate to Login page after successful registration
//     } catch (error) {
//       console.error("Error registering:", error);
//       alert("Failed to register. Check console for details.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

//       {/* Email and Password Inputs */}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />

//       {/* Register Button */}
//       <button
//         onClick={handleRegister}
//         className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-4"
//       >
//         Register
//       </button>

//       {/* Navigate to Login */}
//       <p>
//         Already have an account?{" "}
//         <button
//           onClick={() => router.push("/login")}
//           className="text-blue-400 hover:underline"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { registerWithEmail } from "@/lib/firebaseAuth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@/lib/firebaseConfig";

// const addUserToFirestore = async (user: string) => {
//   try {
//     await setDoc(doc(db, "users", user.uid), {
//       email: user.email.toLowerCase(), // Normalize to lowercase
//       displayName: "Anonymous", // Default value if no display name is provided
//       createdAt: serverTimestamp(),
//     });
//     console.log("User added to Firestore");
//   } catch (error) {
//     console.error("Error adding user to Firestore:", error);
//   }
// };

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleRegister = async () => {
//     try {
//       // Register the user
//       const user = await registerWithEmail(email, password);

//       // Add the user to Firestore
//       await addUserToFirestore(user);

//       alert("Registered successfully!");
//       router.push("/login"); // Navigate to Login page after successful registration
//     } catch (error) {
//       console.error("Error registering:", error);
//       alert("Failed to register. Check console for details.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

//       {/* Email and Password Inputs */}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />

//       {/* Register Button */}
//       <button
//         onClick={handleRegister}
//         className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-4"
//       >
//         Register
//       </button>

//       {/* Navigate to Login */}
//       <p>
//         Already have an account?{" "}
//         <button
//           onClick={() => router.push("/login")}
//           className="text-blue-400 hover:underline"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   );
// }

// // Test
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { registerWithEmail } from "@/lib/firebaseAuth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@/lib/firebaseConfig";
// import { User } from "firebase/auth"; // Import User type from Firebase Auth

// // Function to add a user to Firestore
// const addUserToFirestore = async (user: User) => {
//   try {
//     await setDoc(doc(db, "users", user.uid), {
//       email: user.email?.toLowerCase(), // Normalize email to lowercase
//       displayName: user.displayName || "Anonymous", // Default display name
//       createdAt: serverTimestamp(), // Timestamp for user creation
//     });
//     console.log("User added to Firestore");
//   } catch (error) {
//     console.error("Error adding user to Firestore:", error);
//   }
// };

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   // Handle user registration
//   const handleRegister = async () => {
//     try {
//       // Register the user using Firebase Auth
//       const user = await registerWithEmail(email, password);

//       // Add the registered user to Firestore
//       await addUserToFirestore(user);

//       alert("Registered successfully!");
//       router.push("/login"); // Navigate to login page after successful registration
//     } catch (error) {
//       console.error("Error registering:", error);
//       alert("Failed to register. Check console for details.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

//       {/* Email and Password Inputs */}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />

//       {/* Register Button */}
//       <button
//         onClick={handleRegister}
//         className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-4"
//       >
//         Register
//       </button>

//       {/* Navigate to Login */}
//       <p>
//         Already have an account?{" "}
//         <button
//           onClick={() => router.push("/login")}
//           className="text-blue-400 hover:underline"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { registerWithEmail } from "@/lib/firebaseAuth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@/lib/firebaseConfig";
// import { User } from "firebase/auth"; // Import User type from Firebase Auth

// // Function to add a user to Firestore
// const addUserToFirestore = async (user: User, displayName: string) => {
//   try {
//     await setDoc(doc(db, "users", user.uid), {
//       email: user.email?.toLowerCase(), // Normalize email to lowercase
//       displayName: displayName, // Use the provided display name
//       createdAt: serverTimestamp(), // Timestamp for user creation
//     });
//     console.log("User added to Firestore");
//   } catch (error) {
//     console.error("Error adding user to Firestore:", error);
//   }
// };

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState(""); // New state for user name
//   const router = useRouter();

//   // Handle user registration
//   const handleRegister = async () => {
//     if (!name.trim()) {
//       alert("Please enter your name.");
//       return;
//     }

//     try {
//       // Register the user using Firebase Auth
//       const user = await registerWithEmail(email, password);

//       // Add the registered user to Firestore
//       await addUserToFirestore(user, name.trim());

//       alert("Registered successfully!");
//       router.push("/login"); // Navigate to login page after successful registration
//     } catch (error) {
//       console.error("Error registering:", error);
//       alert("Failed to register. Check console for details.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

//       {/* Name Input */}
//       <input
//         type="text"
//         placeholder="Full Name"
//         value={name}
//         onChange={e => setName(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />

//       {/* Email and Password Inputs */}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         className="w-full max-w-md p-3 rounded-lg border bg-gray-700 text-white mb-4"
//       />

//       {/* Register Button */}
//       <button
//         onClick={handleRegister}
//         className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-4"
//       >
//         Register
//       </button>

//       {/* Navigate to Login */}
//       <p>
//         Already have an account?{" "}
//         <button
//           onClick={() => router.push("/login")}
//           className="text-blue-400 hover:underline"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithEmail } from "@/lib/firebaseAuth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { User } from "firebase/auth"; // Import User type from Firebase Auth
import Image from "next/image";

// Function to add a user to Firestore
const addUserToFirestore = async (user: User, displayName: string) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email?.toLowerCase(), // Normalize email to lowercase
      displayName: displayName, // Use the provided display name
      createdAt: serverTimestamp(), // Timestamp for user creation
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for user name
  const router = useRouter();

  // Handle user registration
  const handleRegister = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      // Register the user using Firebase Auth
      const user = await registerWithEmail(email, password);

      // Add the registered user to Firestore
      await addUserToFirestore(user, name.trim());

      alert("Registered successfully!");
      router.push("/login"); // Navigate to login page after successful registration
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register. Check console for details.");
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

      <div className="wrapper flex flex-col items-center justify-center">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <p className="form-login">Sign Up</p>

          {/* Name Input */}
          <div className="input-box">
            <input
              required
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="input-box">
            <input
              required
              placeholder="Email"
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

          <button
            className="btn flex items-center justify-center"
            type="submit"
          >
            Register
          </button>

          <div className="register-link">
            <p>
              Already have an account?{" "}
              <a onClick={() => router.push("/login")}>Login</a>
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
            justify-content: center; /* Center content vertically */
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
