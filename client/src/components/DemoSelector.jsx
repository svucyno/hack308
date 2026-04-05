import React from 'react';

const categoryIcons = {
  CONSUMER: '🛒',
  RTI: '📋',
  POLICE: '🚨',
  LABOUR: '💼',
  BANK: '🏦',
  MUNICIPAL: '🕳️',
  CIVIL: '⚖️',
};

export default function DemoSelector({ demos, onSelect, t, language }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-heading font-semibold text-lg mb-4">{t('tryExample')}:</h3>

      {/* Horizontal scrollable row */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => onSelect(demo)}
            className="flex-shrink-0 w-72 bg-navy border border-border hover:border-indigo/50 rounded-xl p-4 text-left transition-all snap-start"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{categoryIcons[demo.category] || '📄'}</span>
              <div>
                <span className={`text-xs px-2 py-1 rounded ${
                  demo.color === 'indigo' ? 'bg-indigo/20 text-indigo-300' :
                  demo.color === 'red' ? 'bg-red-500/20 text-red-300' :
                  demo.color === 'green' ? 'bg-green-500/20 text-green-300' :
                  demo.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                  demo.color === 'orange' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {demo.category}
                </span>
              </div>
            </div>
            <h4 className="font-medium mb-2">{demo.label}</h4>
            <p className="text-sm text-gray-400 line-clamp-2">
              {demo.inputText.substring(0, 100)}...
            </p>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center telugu-text">
        {t('exampleLabel')}
      </p>
    </div>
  );
}
