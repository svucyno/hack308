import React, { useState } from 'react';
import GrievanceBadge from './GrievanceBadge';

const strengthConfig = {
  STRONG: { color: 'bg-green-500', label: 'STRONG CASE' },
  MODERATE: { color: 'bg-amber-500', label: 'MODERATE CASE' },
  WEAK: { color: 'bg-red-500', label: 'WEAK CASE' },
};

export default function LetterPreview({
  letterData,
  classification,
  formData,
  t,
  language,
  onDownload,
  onCopy,
  onShare,
  onNew,
  editableLetter,
  setEditableLetter,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const strength = strengthConfig[letterData.strength_assessment] || strengthConfig.MODERATE;

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditableLetter(letterData.letter_body);
    } else {
      setEditableLetter(null);
    }
    setIsEditing(!isEditing);
  };

  const handleLetterChange = (e) => {
    setEditableLetter(e.target.value);
  };

  return (
    <div className="space-y-6">
      <GrievanceBadge classification={classification} t={t} language={language} />

      {/* Letter Preview Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-lg">{letterData.letter_subject}</h3>
          </div>
          <div className={`${strength.color} px-3 py-1 rounded text-xs font-bold text-white`}>
            {strength.label}
          </div>
        </div>

        {/* Letter Body */}
        <div className="p-6">
          <div className="letter-paper rounded-lg p-8 mb-6">
            {isEditing && editableLetter !== null ? (
              <textarea
                value={editableLetter}
                onChange={handleLetterChange}
                rows={25}
                className="w-full h-full font-serif text-gray-800 text-sm leading-relaxed resize-none focus:outline-none"
              />
            ) : (
              <div className="font-serif text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                {letterData.letter_body}
              </div>
            )}
          </div>

          {/* Laws Cited */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Key Laws Cited:</p>
            <div className="flex flex-wrap gap-2">
              {letterData.key_laws_cited.map((law, i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo/20 text-indigo-300 px-3 py-1 rounded-full"
                >
                  {law}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditToggle}
            className="text-sm text-indigo hover:text-indigo-400 transition-colors"
          >
            {isEditing ? t('saveLetter') : t('editLetter')}
          </button>
        </div>

        {/* Sticky Action Bar */}
        <div className="bg-navy border-t border-border px-6 py-4 sticky bottom-0">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onDownload}
              className="flex-1 md:flex-none bg-indigo hover:bg-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              {t('downloadPDF')}
            </button>
            <button
              onClick={onCopy}
              className="flex-1 md:flex-none bg-card border border-border hover:bg-border px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('copyText')}
            </button>
            <button
              onClick={onShare}
              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('shareWhatsApp')}
            </button>
            <button
              onClick={onNew}
              className="flex-1 md:flex-none bg-card border border-border hover:bg-border px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('newLetter')}
            </button>
          </div>
        </div>
      </div>

      {/* Filing Instructions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-heading font-semibold text-xl mb-4">{t('filingHeading')}</h3>

        <div className="space-y-4">
          {/* Where to file */}
          <div className="bg-navy rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Where to File:</p>
            <p className="font-medium">{letterData.filing_instructions.where_to_file}</p>
            {letterData.filing_instructions.portal_url && (
              <a
                href={letterData.filing_instructions.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo hover:text-indigo-400 text-sm mt-1 inline-block"
              >
                {letterData.filing_instructions.portal_url} ↗
              </a>
            )}
          </div>

          {/* Steps */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Steps:</p>
            <ol className="space-y-2">
              {letterData.filing_instructions.how_to_file.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="telugu-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Documents Checklist */}
          <div>
            <p className="text-gray-400 text-sm mb-2">{t('documentsNeeded')}:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {letterData.filing_instructions.documents_needed.map((doc, i) => (
                <label key={i} className="flex items-center gap-2 bg-navy rounded-lg px-3 py-2 cursor-pointer hover:bg-border transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-indigo focus:ring-indigo" />
                  <span className="text-sm telugu-text">{doc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fee and Deadline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-navy rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Fee Required:</p>
              <p className="font-medium">{letterData.filing_instructions.fee_required}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm mb-1">{t('deadline')}:</p>
              <p className="font-medium text-red-300">
                {letterData.filing_instructions.deadline || classification.time_limit_to_file}
              </p>
            </div>
          </div>

          {/* Strength Assessment */}
          <div className="bg-navy rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Case Strength Assessment:</p>
            <div className="flex items-center gap-3 mb-2">
              <div className={`${strength.color} px-3 py-1 rounded text-xs font-bold text-white`}>
                {letterData.strength_assessment}
              </div>
            </div>
            <p className="text-gray-300 telugu-text">{letterData.strength_reason}</p>
          </div>

          {/* Expected Outcome */}
          <div className="bg-navy rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Expected Outcome:</p>
            <p className="text-gray-300 telugu-text">{letterData.expected_outcome}</p>
          </div>
        </div>
      </div>

      {/* Example Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
        <p className="text-amber-300 telugu-text">{t('exampleLabel')}</p>
      </div>
    </div>
  );
}
