import React from 'react'

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 text-green-500 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You for Submitting!
          </h2>
          <p className="text-gray-600 mb-2">
            Your submission has been received and is under review.
          </p>
          <p className="text-gray-600 mb-6">
            We will connect with you shortly.
          </p>
          <div className="text-sm text-gray-500">
            <p>Redirecting to home page...</p>
          </div>
        </div>
      </div>
  )
}

export default ThankYou