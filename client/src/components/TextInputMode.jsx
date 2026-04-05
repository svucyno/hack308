import React, { useState } from 'react';

const quickExamples = {
  POLICE: {
    label: 'Online Fraud',
    text: 'I received a call from someone claiming to be from a government department and cheated me of money by saying my account will be closed. I lost Rs.50,000.',
  },
  CONSUMER: {
    label: 'Defective Product',
    text: 'I bought a product that stopped working after a few days. The seller is refusing to honor the warranty and demanding repair charges.',
  },
  MUNICIPAL: {
    label: 'Road Pothole',
    text: 'There is a large pothole on our street for many months. Many accidents have happened. Multiple complaints to municipal office but no action.',
  },
  BANK: {
    label: 'Unauthorized Deduction',
    text: 'Money was deducted from my account without my permission. Bank is not responding to my complaints and not refunding the amount.',
  },
  LABOUR: {
    label: 'Unpaid Salary',
    text: 'My employer has not paid my salary for several months. Every time I ask, they give excuses. I have family responsibilities and cannot manage.',
  },
  RTI: {
    label: 'Information Request',
    text: 'I need information about the funds spent on road construction in our area. The municipal office is not providing any information.',
  },
  CIVIL: {
    label: 'Property Dispute',
    text: 'There is a boundary dispute with my neighbor. They are claiming part of my land as theirs. I have all property documents.',
  },
};

export default function TextInputMode({ onSubmit, t, initialData, category }) {
  const [formData, setFormData] = useState({
    text: initialData?.text || '',
    name: initialData?.name || '',
    date: initialData?.date || '',
    address: initialData?.address || '',
    against: initialData?.against || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.text.trim()) {
      newErrors.text = 'Problem description is required';
    } else if (formData.text.trim().length < 50) {
      newErrors.text = 'Please describe your problem in more detail (at least 50 characters)';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const loadExample = (text) => {
    setFormData((prev) => ({ ...prev, text }));
    setErrors({});
  };

  const currentExamples = category ? (quickExamples[category] || quickExamples.CONSUMER) : quickExamples.CONSUMER;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
      {/* Quick Example */}
      <div>
        <p className="text-sm text-gray-400 mb-3">{t('tryExample')}:</p>
        <button
          type="button"
          onClick={() => loadExample(currentExamples.text)}
          className="text-sm bg-navy hover:bg-border px-4 py-3 rounded-lg transition-colors text-left w-full"
        >
          <span className="font-medium">{currentExamples.label}</span>
          <p className="text-gray-500 text-xs mt-1">{currentExamples.text.substring(0, 120)}...</p>
        </button>
      </div>

      {/* Problem Description */}
      <div>
        <label className="block text-sm font-medium mb-2 telugu-text">{t('problemLabel')}</label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
          rows={6}
          className={`w-full bg-navy border ${errors.text ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo telugu-text`}
          placeholder="తెలుగు లేదా ఇంగ్లీష్‌లో మీ సమస్యను వివరించండి..."
        />
        {errors.text && <p className="text-red-400 text-sm mt-1">{errors.text}</p>}
        <p className="text-gray-500 text-sm mt-1">{formData.text.length} characters</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2 telugu-text">{t('nameLabel')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={`w-full bg-navy border ${errors.name ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo telugu-text`}
          placeholder="మీ పూర్తి పేరు"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-2 telugu-text">{t('dateLabel')}</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          className="w-full bg-navy border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo telugu-text"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-2 telugu-text">{t('addressLabel')}</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full bg-navy border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo telugu-text"
          placeholder="మీ పూర్తి చిరునామా"
        />
      </div>

      {/* Against */}
      <div>
        <label className="block text-sm font-medium mb-2 telugu-text">{t('againstLabel')}</label>
        <input
          type="text"
          value={formData.against}
          onChange={(e) => setFormData((prev) => ({ ...prev, against: e.target.value }))}
          className="w-full bg-navy border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo telugu-text"
          placeholder="ఎవరిపై ఫిర్యాదు చేయాలి"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo hover:bg-indigo-600 py-4 rounded-lg font-medium text-lg transition-colors"
      >
        {t('submitButton')}
      </button>
    </form>
  );
}
