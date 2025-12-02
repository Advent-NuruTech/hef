"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !review) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "reviews"), {
        name,
        review,
        rating,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setShowForm(false);

      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        router.push("/"); // redirect to homepage
      }, 10000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Rate Your Experience
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <svg
              className={`w-10 h-10 transition-colors ${
                star <= (hoveredStar || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {rating === 5 && "Excellent!"}
        {rating === 4 && "Very Good"}
        {rating === 3 && "Good"}
        {rating === 2 && "Fair"}
        {rating === 1 && "Poor"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header - visible only before submission */}
        {!submitted && (
          <div className="text-center mb-8 animate-bounce">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              We Value Your Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Help us serve you better
            </p>
          </div>
        )}

        {/* Info Card */}
        {showNote && !showForm && (
          <div className="animate-slide-up">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
  Why We Collect Reviews
</h2>
<ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6 list-disc list-inside">
  <li>✓ We want to understand your experience and know what we do wrong and well.</li>
  <li>✓ Honest feedback, both positive and negative, helps us identify areas for improvement.</li>
  <li>✓ All reviews are <strong>100% confidential</strong>, so you can share freely.</li>
  <li>✓ Your input guides us to improve our services and serve you better.</li>
</ul>
              <button
                onClick={() => { setShowNote(false); setShowForm(true); }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105"
              >
                Continue to Review Form
              </button>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showForm && !submitted && (
          <div className="animate-slide-up bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your Name
              </label>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <StarRating />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your Review
              </label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all min-h-[120px] resize-none"
                placeholder="Share your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {review.length} characters
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !name || !review}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="animate-scale-up">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-green-500 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-bold animate-bounce">
                  We value your feedback!
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Redirecting to homepage in
                </p>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {countdown}s
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                Need Advent NuruTech products?{" "}
                <a 
                  href="https://contactnuru.netlify.app/" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline transition-colors"
                >
                  Contact us here
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-scale-up { animation: scale-up 0.5s ease-out; }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
