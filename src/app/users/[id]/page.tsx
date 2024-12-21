"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  Firestore,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function UserPage() {
  const params = useParams(); // Fetch params
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({}); // Track loading per image

  // Normalize params.id to ensure it's a string
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Fetch the logged-in user's ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUserId(user.uid); // Set the current user's ID
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data and images
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userDocRef = doc(db, "users", userId); // Ensure db is typed correctly
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          alert("User not found.");
          router.push("/search"); // Redirect to search page
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, router]);

  // Real-time listener for user's generated images
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", userId, "generatedImages"),
      snapshot => {
        const updatedImages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(updatedImages);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userId]);

  const handleLike = async (imageId: string) => {
    if (!currentUserId) {
      alert("You must be logged in to like an image.");
      return;
    }

    // Prevent multiple clicks by setting the loading state for this image
    if (loadingStates[imageId]) return;

    setLoadingStates(prev => ({ ...prev, [imageId]: true }));

    try {
      // Cast `db` as Firestore and ensure `userId` is a string
      const docRef = doc(
        db as Firestore,
        "users",
        userId as string,
        "generatedImages",
        imageId
      );

      // Fetch the latest image data from Firestore
      const imageSnapshot = await getDoc(docRef);
      if (!imageSnapshot.exists()) {
        console.error("Image does not exist");
        return;
      }

      const imageData = imageSnapshot.data();
      const hasLiked = imageData.likedBy?.includes(currentUserId);

      if (hasLiked) {
        // Unlike the image only if likes are greater than 0
        if (imageData.likes > 0) {
          await updateDoc(docRef, {
            likes: increment(-1),
            likedBy: arrayRemove(currentUserId),
          });
        }
      } else {
        // Like the image
        await updateDoc(docRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUserId),
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      // Reset the loading state for this image
      setLoadingStates(prev => ({ ...prev, [imageId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      {user && (
        <div className="max-w-xl mx-auto bg-gray-800 p-4 rounded-md">
          <h1 className="text-3xl font-bold text-center mb-4">
            {user.displayName}
          </h1>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {user.createdAt?.toDate().toLocaleDateString()}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Generated Images</h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {images.map(image => (
            <div
              key={image.id}
              className="bg-gray-800 rounded-md shadow-lg p-4 flex flex-col items-center justify-between"
              style={{ width: "450px", height: "550px" }} // Ensure consistent box size
            >
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-3/4 object-cover rounded-md"
              />
              <div className="w-full flex flex-col items-center mt-2">
                <p className="text-sm text-center">{image.prompt}</p>
                <p className="mt-2 text-red-400 text-sm">
                  ❤️ {image.likes || 0} Likes
                </p>
                <button
                  onClick={() => handleLike(image.id)}
                  className={`mt-2 px-3 py-1 rounded-md text-sm text-white ${
                    image.likedBy?.includes(currentUserId || "")
                      ? "bg-red-500"
                      : "bg-gray-700"
                  }`}
                  disabled={!!loadingStates[image.id]}
                >
                  {image.likedBy?.includes(currentUserId || "")
                    ? "❤️ Liked"
                    : "🤍 Like"}
                </button>
              </div>

              <div className="flex justify-between w-full mt-2 text-sm">
                <a href={image.imageUrl} download className="text-green-400">
                  Download
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(image.imageUrl);
                    alert("Link copied to clipboard!");
                  }}
                  className="text-yellow-400"
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
}
