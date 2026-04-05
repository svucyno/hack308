import React from 'react';
import GrievanceBadge from './GrievanceBadge';

export default function LoadingLetter({ classification, message, t, language }) {
  return (
    <div className="space-y-6">
      <GrievanceBadge classification={classification} t={t} language={language} />

      <div className="bg-card border border-border rounded-xl p-12 text-center">
        {/* Rotating loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">⚖️</span>
          </div>
        </div>

        <h3 className="text-xl font-heading font-semibold mb-2">Generating Your Legal Letter</h3>
        <p className="text-gray-400 telugu-text mb-4">{message}</p>

        {/* Progress indicator */}
        <div className="max-w-md mx-auto">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Estimated time: ~20 seconds</p>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-navy rounded-lg p-4 text-left">
          <p className="text-sm text-gray-400 mb-2">💡 While you wait:</p>
          <ul className="text-sm text-gray-500 space-y-1 telugu-text">
            <li>• Your letter will be generated in formal English</li>
            <li>• All relevant Indian laws will be cited</li>
            <li>• Complete filing instructions will be included</li>
            <li>• You can download as PDF or copy the text</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
