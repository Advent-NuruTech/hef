"use client";

import React from "react";

export default function ContributionPage() {
  const paybillNumber = "247247"; 
  const accountNumber = "0757325011"; 
  const amount = ""; 

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-indigo-600">
          Young Evangelist Ministry Contribution
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Support the ministry by sending your contribution via MPesa Paybill.
        </p>

        {/* Paybill Info Card */}
        <div className="bg-indigo-50 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Paybill:</span>
            <span className="text-indigo-700 font-bold">{paybillNumber}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Account Number:</span>
            <span className="text-indigo-700 font-bold">{accountNumber}</span>
          </div>
        </div>

        {/* MPesa Payment Button */}
      
       
        <p className="text-gray-400 text-xs mt-4 text-center">
         Thanks for walking with us in this journey
        </p>
      </div>
    </div>
  );
}
