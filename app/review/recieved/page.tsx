"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp, deleteDoc, doc } from "firebase/firestore";

type Review = {
  id: string;
  name: string;
  review: string;
  rating: number;
  createdAt?: Timestamp;
};

export default function ReceivedReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list: Review[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as Omit<Review, "id">;
          list.push({ id: doc.id, ...data });
        });
        setReviews(list);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const filteredReviews = filter 
    ? reviews.filter(r => r.rating === filter)
    : reviews;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Customer Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Feedback from our valued customers
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800 animate-slide-up">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              All reviews are <strong>confidential</strong> and visible only to our team. We use this feedback to improve our services.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
            {/* Total Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{reviews.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Rating Distribution</p>
              <div className="space-y-1">
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-700 dark:text-gray-300 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full rounded-full transition-all"
                        style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {!loading && reviews.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-700 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === null
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                return (
                  <button
                    key={rating}
                    onClick={() => setFilter(rating)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filter === rating
                        ? "bg-yellow-400 text-gray-900 shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {"⭐".repeat(rating)} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <svg className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700 animate-scale-up">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Reviews Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              once user review they shall be updated here!
            </p>
          </div>
        )}

        {/* Reviews List */}
        {!loading && filteredReviews.length > 0 && (
          <div className="space-y-4 animate-slide-up">
            {filteredReviews.map((r) => {
              const date = r.createdAt?.toDate();
              const formattedDate = date
                ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
                : "Unknown date";

              return (
                <div
                  key={r.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                          {r.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Stars + Delete */}
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < r.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      {r.review}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filtered Empty State */}
        {!loading && filter !== null && filteredReviews.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No reviews found with {filter} star{filter !== 1 ? "s" : ""}.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-scale-up { animation: scale-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}
