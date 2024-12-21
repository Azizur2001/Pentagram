"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  startAfter,
  getDocs,
  deleteDoc,
  doc,
  limit,
  increment,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

interface Image {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
  likedBy: string[];
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Image[]>([]);
  const [lastDocSnapshot, setLastDocSnapshot] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Authenticate User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        fetchHistory(true);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Save Image to Firestore
  const saveToFirestore = async (imageUrl: string, prompt: string) => {
    try {
      if (!userId) throw new Error("User not logged in");
      await addDoc(collection(db, `users/${userId}/generatedImages`), {
        prompt,
        imageUrl,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Fetch History
  const fetchHistory = async (reset: boolean = false) => {
    try {
      if (!userId) return;

      let q = query(
        collection(db, `users/${userId}/generatedImages`),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      if (searchQuery.trim()) {
        q = query(
          collection(db, `users/${userId}/generatedImages`),
          where("prompt", ">=", searchQuery),
          where("prompt", "<=", searchQuery + "\uf8ff"),
          orderBy("prompt"),
          limit(6)
        );
      }

      if (!reset && lastDocSnapshot) {
        q = query(q, startAfter(lastDocSnapshot));
      }

      const snapshot = await getDocs(q);
      const newHistory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Image[];

      setHistory(prev => {
        const uniqueItems = new Map<string, Image>();
        (reset ? newHistory : [...prev, ...newHistory]).forEach(item =>
          uniqueItems.set(item.id, item)
        );
        return Array.from(uniqueItems.values());
      });

      setLastDocSnapshot(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const deleteImage = async (docId: string) => {
    try {
      if (!userId) throw new Error("User not logged in");
      await deleteDoc(doc(db, `users/${userId}/generatedImages/${docId}`));
      setHistory(prev => prev.filter(item => item.id !== docId));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Handle Like
  const handleLike = async (docId: string) => {
    if (!userId) {
      alert("You must be logged in to like an image.");
      return;
    }

    // Prevent spamming by checking loading state
    if (loadingStates[docId]) return;

    // Set loading state for the specific image
    setLoadingStates(prev => ({ ...prev, [docId]: true }));

    try {
      const docRef = doc(db, `users/${userId}/generatedImages`, docId);

      // Fetch the latest image data
      const imageSnapshot = await getDoc(docRef);
      if (!imageSnapshot.exists()) {
        console.error("Image does not exist");
        return;
      }

      const imageData = imageSnapshot.data() as Image;
      const hasLiked = imageData.likedBy?.includes(userId);

      // Update Firestore based on like/unlike action
      if (!hasLiked) {
        await updateDoc(docRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
        });
      } else if (imageData.likes > 0) {
        await updateDoc(docRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId),
        });
      }

      // Update local state
      setHistory(prevHistory =>
        prevHistory.map(item =>
          item.id === docId
            ? {
                ...item,
                likes: hasLiked
                  ? Math.max((item.likes || 0) - 1, 0) // Prevent negative likes
                  : (item.likes || 0) + 1,
                likedBy: hasLiked
                  ? item.likedBy.filter(id => id !== userId)
                  : [...item.likedBy, userId],
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      // Reset loading state for the specific image
      setLoadingStates(prev => ({ ...prev, [docId]: false }));
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        await saveToFirestore(data.imageUrl, inputText);
        fetchHistory(true);
      } else {
        alert("Failed to generate image.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 rounded"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold text-center mb-6">
        Generate an Image ✨
      </h1>

      {/* Search */}
      <div className="max-w-xl mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-white text-sm font-semibold">
            Please enter something
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="flex w-full rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search prompts..."
              className="w-full bg-gray-700 text-sm text-white p-2 rounded-md rounded-r-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => fetchHistory(true)}
              className="bg-indigo-600 text-white px-4 text-sm font-semibold py-2 rounded-r-md"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => {
              setSearchQuery(""); // Clear the search query
              fetchHistory(true); // Fetch all history
            }}
            className="bg-white text-black px-4 text-sm font-semibold py-2 rounded-md"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-w-xl mb-6">
        <div className="flex w-full rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Describe the image... (e.g. Cat in a hat)"
            className="w-full bg-gray-700 text-sm text-white p-2 rounded-md rounded-r-none"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 text-sm font-semibold py-2 rounded-r-md"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {imageUrl && (
        <div className="text-center mb-8">
          <img
            src={imageUrl}
            alt="Generated"
            className="w-[450px] h-[450px] object-cover rounded-lg mx-auto"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {history.map(item => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-md shadow-lg p-4 flex flex-col items-center justify-between"
            style={{ width: "450px", height: "550px" }} // Ensure consistent box size
          >
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="w-full h-3/4 object-cover rounded-md"
            />
            <div className="w-full flex flex-col items-center mt-2">
              <p className="text-sm text-center">{item.prompt}</p>
              <p className="mt-2 text-red-400 text-sm">
                ❤️ {item.likes || 0} Likes
              </p>
              <button
                onClick={() => handleLike(item.id)}
                className={`mt-2 px-3 py-1 rounded-md text-sm text-white ${
                  item.likedBy?.includes(userId || "")
                    ? "bg-red-500"
                    : "bg-gray-700"
                }`}
                disabled={!!loadingStates[item.id]}
              >
                {item.likedBy?.includes(userId || "") ? "❤️ Liked" : "🤍 Like"}
              </button>
            </div>

            <div className="flex justify-between w-full mt-2 text-sm">
              <a href={item.imageUrl} download className="text-green-400">
                Download
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(item.imageUrl);
                  alert("Link copied to clipboard!");
                }}
                className="text-yellow-400"
              >
                Share
              </button>
              <button
                onClick={() => deleteImage(item.id)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => fetchHistory(false)}
        className="mt-6 px-4 py-2 bg-blue-500 rounded-md text-sm"
      >
        Load More
      </button>
      <div className="text-center my-4">
        <button
          onClick={() => router.push("/search")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search Users
        </button>
      </div>
    </div>
  );
}
