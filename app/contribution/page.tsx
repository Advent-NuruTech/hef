"use client";

import React from "react";

export default function ContributionPage() {
  const paybillNumber = "247247"; 
  const accountNumber = "0757325011"; 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 max-w-md w-full transition-colors duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-indigo-600 dark:text-indigo-400">
          Young Evangelist Ministry Contribution
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Support the ministry by sending your contribution via MPesa Paybill. Your generosity helps us spread the gospel and uphold True Education.
        </p>

        {/* Paybill Info Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-xl mb-6 transition-colors duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Paybill:</span>
            <span className="text-indigo-700 dark:text-indigo-200 font-bold">{paybillNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Account Number:</span>
            <span className="text-indigo-700 dark:text-indigo-200 font-bold">{accountNumber}</span>
          </div>
        </div>

        {/* Optional MPesa Payment Button */}
        <button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Copy Details
        </button>

        <p className="text-gray-500 dark:text-gray-400 text-xs mt-4 text-center">
          Thanks for walking with us in this journey. Your support empowers our ministry to reach more souls.
        </p>
      </div>
    </div>
  );
}
