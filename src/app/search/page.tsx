// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebaseConfig";

// export default function SearchUsers() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSearch = async () => {
//     setError(""); // Clear previous errors

//     if (!searchQuery.trim()) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     const email = searchQuery.trim().toLowerCase();
//     console.log("Searching for email:", email);

//     try {
//       const q = query(collection(db, "users"), where("email", "==", email));
//       const snapshot = await getDocs(q);

//       console.log("Query snapshot:", snapshot.docs);

//       if (snapshot.empty) {
//         setError("No user found with this email.");
//         return;
//       }

//       const userDoc = snapshot.docs[0]; // Assuming email is unique
//       router.push(`/users/${userDoc.id}`);
//     } catch (err) {
//       console.error("Error searching user:", err);
//       setError("An error occurred while searching.");
//     }
//   };

//   return (
//     <div className="min-h-screen p-8 bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold text-center mb-6">Search Users</h1>
//       <div className="max-w-xl mx-auto">
//         <input
//           type="text"
//           placeholder="Enter user's email..."
//           className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
//           value={searchQuery}
//           onChange={e => setSearchQuery(e.target.value)}
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
//         >
//           Search
//         </button>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    setError(""); // Clear previous errors

    if (!searchQuery.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    const email = searchQuery.trim().toLowerCase(); // Normalize input to lowercase
    console.log("Searching for email:", email);

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No user found with this email.");
        return;
      }

      const userDoc = snapshot.docs[0]; // Assuming email is unique
      console.log("Found user document:", userDoc.data());
      router.push(`/users/${userDoc.id}`); // Redirect to user's page
    } catch (err) {
      console.error("Error searching user:", err);
      setError("An error occurred while searching.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Search Users</h1>
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Enter user's email..."
          className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          Search
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
