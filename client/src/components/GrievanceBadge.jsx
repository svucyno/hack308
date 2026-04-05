import React from 'react';

const categoryColors = {
  CONSUMER: 'bg-indigo',
  RTI: 'bg-amber-500',
  POLICE: 'bg-red-500',
  LABOUR: 'bg-orange-500',
  BANK: 'bg-green-500',
  MUNICIPAL: 'bg-blue-500',
  CIVIL: 'bg-purple-500',
};

const urgencyColors = {
  URGENT: 'bg-red-500/20 text-red-400 border-red-500/30',
  NORMAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function GrievanceBadge({ classification, t, language }) {
  if (!classification) return null;

  const colorClass = categoryColors[classification.grievance_category] || 'bg-indigo';

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-wrap items-start gap-4">
        {/* Category Badge */}
        <div className={`${colorClass} px-4 py-2 rounded-lg font-semibold text-sm`}>
          {classification.grievance_category}
        </div>

        {/* Urgency Badge */}
        <div className={`px-4 py-2 rounded-lg font-medium text-sm border ${urgencyColors[classification.urgency]}`}>
          {classification.urgency}
        </div>

        {/* Confidence */}
        <div className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-700/50 text-gray-300">
          Confidence: {classification.confidence}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-gray-500 text-sm">{t('categoryLabel')}</p>
          <p className="font-medium telugu-text">{classification.grievance_subcategory}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{t('authorityLabel')}</p>
          <p className="font-medium telugu-text">{classification.filing_authority}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{t('timeLimitLabel')}</p>
          <p className="font-medium telugu-text">{classification.time_limit_to_file}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Applicable Laws</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {classification.applicable_laws.map((law, i) => (
              <span key={i} className="text-xs bg-indigo/20 text-indigo-300 px-2 py-1 rounded">
                {law.length > 40 ? law.substring(0, 40) + '...' : law}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
