// // src/lib/firebaseAuth.ts
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   User,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { auth } from "./firebaseConfig"; // Correcting to lowercase 'i'

// // export const registerWithEmail = async (email: string, password: string) => {
// //   return createUserWithEmailAndPassword(auth, email, password);
// // };

// export const registerWithEmail = async (email: string, password: string) => {
//   const userCredential = await createUserWithEmailAndPassword(
//     auth,
//     email,
//     password
//   );
//   return userCredential.user; // Return the user object
// };

// export const loginWithEmail = async (email: string, password: string) => {
//   return signInWithEmailAndPassword(auth, email, password);
// };

// export const logout = async () => {
//   return signOut(auth);
// };

// export const subscribeToAuthChanges = (
//   callback: (user: User | null) => void
// ) => {
//   return onAuthStateChanged(auth, callback);
// };

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Ensure firebaseConfig is correctly imported

// Function to add user to Firestore
const addUserToFirestore = async (user: User) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email?.toLowerCase(), // Normalize email to lowercase
      displayName: user.displayName || "Anonymous", // Provide default displayName
      createdAt: serverTimestamp(), // Timestamp for user creation
    });
    console.log("User added to Firestore successfully.");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

// Register user with email and password, and add them to Firestore
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Add user to Firestore
    await addUserToFirestore(user);

    return user; // Return the user object
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

// Login user with email and password
export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout the current user
export const logout = async () => {
  return signOut(auth);
};

// Subscribe to authentication state changes
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
