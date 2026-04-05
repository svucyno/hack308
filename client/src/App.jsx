import React, { useState, useEffect, useCallback } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import TextInputMode from './components/TextInputMode';
import GrievanceBadge from './components/GrievanceBadge';
import LoadingLetter from './components/LoadingLetter';
import LetterPreview from './components/LetterPreview';
import ErrorBoundary from './components/ErrorBoundary';
import { generateLetterPDF } from './utils/generateLetterPDF';

const translations = {
  en: {
    appName: 'VaakSakshi',
    tagline: 'Speak your problem. Get a legal letter.',
    selectComplaintType: 'Select Complaint Type',
    selectComplaintTypeDesc: 'Choose which type of legal letter you need',
    policeComplaint: '🚨 Police Complaint',
    policeComplaintDesc: 'FIR, theft, fraud, assault, criminal matters',
    consumerComplaint: '🛒 Consumer Complaint',
    consumerComplaintDesc: 'Defective products, poor service, warranty issues',
    municipalComplaint: '🏛️ Municipal Complaint',
    municipalComplaintDesc: 'Roads, garbage, water, street lights, civic issues',
    bankComplaint: '🏦 Bank Complaint',
    bankComplaintDesc: 'Unauthorized charges, loan disputes, banking service',
    labourComplaint: '💼 Labour Complaint',
    labourComplaintDesc: 'Unpaid salary, wrongful termination, workplace issues',
    rtiApplication: '📋 RTI Application',
    rtiApplicationDesc: 'Right to Information requests to government',
    civilComplaint: '⚖️ Civil Complaint',
    civilComplaintDesc: 'General civil matters, property disputes, notices',
    voiceInput: '🎙️ Speak in Telugu/English',
    textInput: '⌨️ Type Your Complaint',
    backToSelection: 'Back to Complaint Types',
    micIdle: 'Tap to Speak',
    micRecording: 'Listening... Tap to Stop',
    micDone: 'Done! Review below',
    transcriptPlaceholder: 'మీ సమస్యను తెలుగు లేదా ఇంగ్లీష్‌లో వివరించండి',
    generateButton: 'Generate My Letter',
    recordAgain: 'Record Again',
    problemLabel: 'మీ సమస్యను వివరించండి',
    nameLabel: 'మీ పేరు',
    addressLabel: 'మీ చిరునామా',
    againstLabel: 'ఫిర్యాదు ఎవరిపై',
    dateLabel: 'ఇది ఎప్పుడు జరిగింది',
    submitButton: 'లేఖను రూపొందించండి',
    downloadPDF: 'Download PDF',
    copyText: 'Copy Letter',
    newLetter: 'New Letter',
    shareWhatsApp: 'Share on WhatsApp',
    filingHeading: 'How to File',
    documentsNeeded: 'Documents Needed',
    deadline: 'Deadline',
    loading1: 'లేఖ సిద్ధమవుతోంది...',
    loading2: 'చట్టాలను తనిఖీ చేస్తోంది...',
    loading3: 'ముసాయిదా తయారు చేస్తోంది...',
    loading4: 'దాదాపు పూర్తయింది...',
    exampleLabel: '⚠️ Example letter — Fill in your details before filing',
    errorOffline: 'You are offline. Please try again when connected.',
    rateLimitError: 'చాలా అభ్యర్థనలు వచ్చాయి. 60 సెకన్లు వేచి ఉండండి.',
    chromeWarning: 'వాయిస్ రికార్డింగ్‌కు Google Chrome అవసరం. దిగువ టెక్స్ట్ ఇన్‌పుట్ ఉపయోగించండి.',
    footer: 'Powered by Google Gemini AI. Built for Hack308. Empowering every Telugu citizen\'s legal voice.',
    categoryLabel: 'Category',
    urgencyLabel: 'Urgency',
    authorityLabel: 'Filing Authority',
    timeLimitLabel: 'Time Limit',
    strengthLabel: 'Case Strength',
    editLetter: 'Edit Letter',
    saveLetter: 'Save Changes',
    copSuccess: 'Letter copied to clipboard!',
    shareSuccess: 'Opening WhatsApp...',
    tellUsInYourWords: 'తెలుగు లేదా ఇంగ్లీష్‌లో మీ సమస్యను వివరించండి',
    tellUsInYourWordsDesc: 'AI will understand your Telugu/English and generate a formal legal letter in English',
  },
  te: {
    appName: 'వాక్సాక్షి',
    tagline: 'మీ సమస్య చెప్పండి. చట్టపరమైన లేఖ పొందండి.',
    selectComplaintType: 'ఫిర్యాదు రకాన్ని ఎంచుకోండి',
    selectComplaintTypeDesc: 'మీకు ఏ రకమైన చట్టపరమైన లేఖ కావాలో ఎంచుకోండి',
    policeComplaint: '🚨 పోలీస్ ఫిర్యాదు',
    policeComplaintDesc: 'ఎఫ్ఐఆర్, దొంగతనం, మోసం, దాడి, నేరపూరిత విషయాలు',
    consumerComplaint: '🛒 వినియోగదారుడి ఫిర్యాదు',
    consumerComplaintDesc: 'లోపభూయిష్ట ఉత్పత్తులు, చెడు సేవ, వారంటీ సమస్యలు',
    municipalComplaint: '🏛️ మున్సిపల్ ఫిర్యాదు',
    municipalComplaintDesc: 'రోడ్లు, చెత్త, నీరు, వీధి దీపాలు, పౌర సమస్యలు',
    bankComplaint: '🏦 బ్యాంకు ఫిర్యాదు',
    bankComplaintDesc: 'అనధికారిక ఛార్జీలు, రుణ వివాదాలు, బ్యాంకింగ్ సేవ',
    labourComplaint: '💼 లేబర్ ఫిర్యాదు',
    labourComplaintDesc: 'చెల్లించని జీతం, తప్పుగా ఉద్యోగం తీసివేత, పనిప్రదేశ సమస్యలు',
    rtiApplication: '📋 ఆర్టీఐ దరఖాస్తు',
    rtiApplicationDesc: 'ప్రభుత్వం నుండి సమాచారం పొందడానికి అభ్యర్థనలు',
    civilComplaint: '⚖️ సివిల్ ఫిర్యాదు',
    civilComplaintDesc: 'సాధారణ సివిల్ విషయాలు, ఆస్తి వివాదాలు, నోటీసులు',
    voiceInput: '🎙️ తెలుగు/ఇంగ్లీష్‌లో మాట్లాడండి',
    textInput: '⌨️ మీ ఫిర్యాదును టైప్ చేయండి',
    backToSelection: 'ఫిర్యాదు రకాలకు తిరిగి వెళ్ళు',
    micIdle: 'మాట్లాడడానికి నొక్కండి',
    micRecording: 'వినడం జరుగుతోంది... ఆపడానికి నొక్కండి',
    micDone: 'అయింది! దిగువ సమీక్షించండి',
    transcriptPlaceholder: 'మీ సమస్యను తెలుగు లేదా ఇంగ్లీష్‌లో వివరించండి',
    generateButton: 'నా లేఖను రూపొందించండి',
    recordAgain: 'మళ్ళీ రికార్డ్ చేయండి',
    problemLabel: 'మీ సమస్యను వివరించండి',
    nameLabel: 'మీ పేరు',
    addressLabel: 'మీ చిరునామా',
    againstLabel: 'ఫిర్యాదు ఎవరిపై',
    dateLabel: 'ఇది ఎప్పుడు జరిగింది',
    submitButton: 'లేఖను రూపొందించండి',
    downloadPDF: 'PDF డౌన్‌లోడ్ చేయండి',
    copyText: 'లేఖ కాపీ చేయండి',
    newLetter: 'కొత్త లేఖ',
    shareWhatsApp: 'WhatsApp లో పంచుకోండి',
    filingHeading: 'దాఖలు చేయడం ఎలా',
    documentsNeeded: 'అవసరమైన పత్రాలు',
    deadline: 'చివరి తేదీ',
    loading1: 'లేఖ సిద్ధమవుతోంది...',
    loading2: 'చట్టాలను తనిఖీ చేస్తోంది...',
    loading3: 'ముసాయిదా తయారు చేస్తోంది...',
    loading4: 'దాదాపు పూర్తయింది...',
    exampleLabel: '⚠️ ఉదాహరణ లేఖ — దాఖలు చేయడానికి ముందు మీ వివరాలు నింపండి',
    errorOffline: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కనెక్ట్ అయినప్పుడు మళ్లీ ప్రయత్నించండి.',
    rateLimitError: 'చాలా అభ్యర్థనలు వచ్చాయి. 60 సెకన్లు వేచి ఉండండి.',
    chromeWarning: 'వాయిస్ రికార్డింగ్‌కు Google Chrome అవసరం. దిగువ టెక్స్ట్ ఇన్‌పుట్ ఉపయోగించండి.',
    footer: 'Google Gemini AI చే శక్తి పొందింది. Hack308 కోసం నిర్మించబడింది. ప్రతి తెలుగు పౌరుడి చట్టపరమైన గొంతుకు అధికారం ఇస్తోంది.',
    categoryLabel: 'వర్గం',
    urgencyLabel: 'అత్యవసరత',
    authorityLabel: 'దాఖలు అధికారం',
    timeLimitLabel: 'సమయ పరిమితి',
    strengthLabel: 'కేసు బలం',
    editLetter: 'లేఖను సవరించండి',
    saveLetter: 'మార్పులు సేవ్ చేయండి',
    copSuccess: 'లేఖ క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
    shareSuccess: 'WhatsApp తెరుస్తోంది...',
    tellUsInYourWords: 'తెలుగు లేదా ఇంగ్లీష్‌లో మీ సమస్యను వివరించండి',
    tellUsInYourWordsDesc: 'AI మీ తెలుగు/ఇంగ్లీష్ అర్థం చేసుకుని, ఫార్మల్ చట్టపరమైన లేఖను ఇంగ్లీష్‌లో తయారు చేస్తుంది',
  },
};

const loadingMessages = ['loading1', 'loading2', 'loading3', 'loading4'];

const complaintTypes = [
  { id: 'POLICE', icon: '🚨', color: 'red', nameEn: 'Police Complaint', nameTe: 'పోలీస్ ఫిర్యాదు', descEn: 'FIR, theft, fraud, assault, criminal matters', descTe: 'ఎఫ్ఐఆర్, దొంగతనం, మోసం, దాడి, నేరపూరిత విషయాలు' },
  { id: 'CONSUMER', icon: '🛒', color: 'indigo', nameEn: 'Consumer Complaint', nameTe: 'వినియోగదారుడి ఫిర్యాదు', descEn: 'Defective products, poor service, warranty issues', descTe: 'లోపభూయిష్ట ఉత్పత్తులు, చెడు సేవ, వారంటీ సమస్యలు' },
  { id: 'MUNICIPAL', icon: '🏛️', color: 'blue', nameEn: 'Municipal Complaint', nameTe: 'మున్సిపల్ ఫిర్యాదు', descEn: 'Roads, garbage, water, street lights, civic issues', descTe: 'రోడ్లు, చెత్త, నీరు, వీధి దీపాలు, పౌర సమస్యలు' },
  { id: 'BANK', icon: '🏦', color: 'green', nameEn: 'Bank Complaint', nameTe: 'బ్యాంకు ఫిర్యాదు', descEn: 'Unauthorized charges, loan disputes, banking service', descTe: 'అనధికారిక ఛార్జీలు, రుణ వివాదాలు, బ్యాంకింగ్ సేవ' },
  { id: 'LABOUR', icon: '💼', color: 'orange', nameEn: 'Labour Complaint', nameTe: 'లేబర్ ఫిర్యాదు', descEn: 'Unpaid salary, wrongful termination, workplace issues', descTe: 'చెల్లించని జీతం, తప్పుగా ఉద్యోగం తీసివేత, పనిప్రదేశ సమస్యలు' },
  { id: 'RTI', icon: '📋', color: 'amber', nameEn: 'RTI Application', nameTe: 'ఆర్టీఐ దరఖాస్తు', descEn: 'Right to Information requests to government', descTe: 'ప్రభుత్వం నుండి సమాచారం పొందడానికి అభ్యర్థనలు' },
  { id: 'CIVIL', icon: '⚖️', color: 'purple', nameEn: 'Civil Complaint', nameTe: 'సివిల్ ఫిర్యాదు', descEn: 'General civil matters, property disputes, notices', descTe: 'సాధారణ సివిల్ విషయాలు, ఆస్తి వివాదాలు, నోటీసులు' },
];

export default function App() {
  const [language, setLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stage, setStage] = useState('selection'); // selection, input, classifying, classified, generating, complete, error
  const [transcript, setTranscript] = useState('');
  const [formData, setFormData] = useState({ text: '', name: '', date: '', address: '', against: '' });
  const [classification, setClassification] = useState(null);
  const [letterData, setLetterData] = useState(null);
  const [error, setError] = useState(null);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [editableLetter, setEditableLetter] = useState(null);

  const t = useCallback((key) => translations[language][key] || key, [language]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (stage === 'generating' && rateLimitTimer === 0) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % 4);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [stage, rateLimitTimer]);

  useEffect(() => {
    let countdown;
    if (rateLimitTimer > 0) {
      countdown = setInterval(() => {
        setRateLimitTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [rateLimitTimer]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStage('input');
  };

  const handleVoiceComplete = (text) => {
    setTranscript(text);
    setFormData((prev) => ({ ...prev, text }));
  };

  const handleFormSubmit = async (data) => {
    setFormData(data);
    await generateLetter(data.text, selectedCategory, data);
  };

  const generateLetter = async (text, category, extraData = {}) => {
    setStage('generating');
    setError(null);

    try {
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          name: extraData.name || formData.name,
          date: extraData.date || formData.date,
          address: extraData.address || formData.address,
          against: extraData.against || formData.against,
          category,
        }),
      });

      if (genRes.status === 429) {
        setRateLimitTimer(60);
        setStage('error');
        setError('RATE_LIMIT');
        return;
      }

      const letterData = await genRes.json();

      // Create classification from category
      const categoryData = complaintTypes.find(c => c.id === category);
      setClassification({
        grievance_category: category,
        grievance_subcategory: categoryData?.nameEn || category,
        urgency: 'NORMAL',
        applicable_laws: letterData.key_laws_cited || [],
        filing_authority: letterData.filing_instructions?.where_to_file || 'Relevant Authority',
        filing_portal: letterData.filing_instructions?.portal_url || '',
        time_limit_to_file: letterData.filing_instructions?.deadline || 'As applicable',
        confidence: 'HIGH',
      });

      setLetterData(letterData);
      setStage('complete');
    } catch (err) {
      setStage('error');
      setError(err.message || 'Generation failed');
    }
  };

  const handleDownloadPDF = () => {
    if (!letterData) return;
    const { doc, filename } = generateLetterPDF(letterData, formData, classification?.grievance_category || selectedCategory);
    doc.save(filename);
  };

  const handleCopyText = () => {
    if (!letterData) return;
    const fullText = `${letterData.letter_subject}\n\n${letterData.letter_body}`;
    navigator.clipboard.writeText(fullText);
    alert(t('copSuccess'));
  };

  const handleShareWhatsApp = () => {
    if (!letterData) return;
    const text = encodeURIComponent(`${letterData.letter_subject}\n\n${letterData.letter_body.substring(0, 500)}...`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNewLetter = () => {
    setStage('selection');
    setTranscript('');
    setFormData({ text: '', name: '', date: '', address: '', against: '' });
    setSelectedCategory(null);
    setClassification(null);
    setLetterData(null);
    setError(null);
    setEditableLetter(null);
  };

  const handleBackToSelection = () => {
    setStage('selection');
    setTranscript('');
    setFormData({ text: '', name: '', date: '', address: '', against: '' });
    setSelectedCategory(null);
    setError(null);
  };

  const handleRetry = () => {
    if (rateLimitTimer > 0) return;
    generateLetter(formData.text, selectedCategory);
  };

  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  const selectedCategoryData = complaintTypes.find(c => c.id === selectedCategory);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-navy text-white font-body">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl">{t('appName')}</h1>
              <p className="text-sm text-gray-400 hidden md:block">{t('tagline')}</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
          </div>
        </header>

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-amber-900/50 border-b border-amber-700 px-4 py-2 text-center text-amber-200 text-sm">
            {t('errorOffline')}
          </div>
        )}

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Selection Screen */}
          {stage === 'selection' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-heading font-bold text-3xl mb-3">{t('selectComplaintType')}</h2>
                <p className="text-gray-400 telugu-text text-lg">{t('selectComplaintTypeDesc')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaintTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleCategorySelect(type.id)}
                    className={`bg-card border border-border hover:border-indigo/50 rounded-xl p-6 text-left transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo/10`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{type.icon}</span>
                      <div>
                        <h3 className="font-heading font-semibold text-lg">
                          {language === 'te' ? type.nameTe : type.nameEn}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          type.color === 'indigo' ? 'bg-indigo/20 text-indigo-300' :
                          type.color === 'red' ? 'bg-red-500/20 text-red-300' :
                          type.color === 'green' ? 'bg-green-500/20 text-green-300' :
                          type.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                          type.color === 'orange' ? 'bg-orange-500/20 text-orange-300' :
                          type.color === 'amber' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {type.id}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm telugu-text">
                      {language === 'te' ? type.descTe : type.descEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Screen */}
          {stage === 'input' && selectedCategoryData && (
            <div className="space-y-8">
              {/* Back button and category info */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToSelection}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← {t('backToSelection')}
                </button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{selectedCategoryData.icon}</span>
                  <div>
                    <h2 className="font-heading font-bold text-2xl">
                      {language === 'te' ? selectedCategoryData.nameTe : selectedCategoryData.nameEn}
                    </h2>
                    <p className="text-gray-400 telugu-text">
                      {language === 'te' ? selectedCategoryData.descTe : selectedCategoryData.descEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mb-4">
                <h3 className="font-heading font-semibold text-xl mb-2 telugu-text">{t('tellUsInYourWords')}</h3>
                <p className="text-gray-400 telugu-text">{t('tellUsInYourWordsDesc')}</p>
              </div>

              {/* Voice or Text Input */}
              <VoiceRecorder
                language={language}
                onVoiceComplete={handleVoiceComplete}
                t={t}
                isChrome={isChrome}
                category={selectedCategory}
                onSubmit={handleFormSubmit}
              />

              {/* Text Input Alternative */}
              <div className="mt-8">
                <TextInputMode
                  onSubmit={handleFormSubmit}
                  t={t}
                  initialData={formData}
                  category={selectedCategory}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {stage === 'generating' && (
            <div className="space-y-6">
              {classification && <GrievanceBadge classification={classification} t={t} language={language} />}
              <LoadingLetter
                classification={classification || { grievance_category: selectedCategory }}
                message={t(loadingMessages[loadingMessageIndex])}
                t={t}
                language={language}
              />
            </div>
          )}

          {/* Complete - Letter Preview */}
          {stage === 'complete' && letterData && classification && (
            <LetterPreview
              letterData={letterData}
              classification={classification}
              formData={formData}
              t={t}
              language={language}
              onDownload={handleDownloadPDF}
              onCopy={handleCopyText}
              onShare={handleShareWhatsApp}
              onNew={handleNewLetter}
              editableLetter={editableLetter}
              setEditableLetter={setEditableLetter}
            />
          )}

          {/* Error State */}
          {stage === 'error' && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">❌</div>
              {error === 'RATE_LIMIT' ? (
                <>
                  <h3 className="text-xl font-heading font-semibold mb-2">{t('rateLimitError')}</h3>
                  {rateLimitTimer > 0 ? (
                    <p className="text-3xl font-bold text-indigo mb-4">{rateLimitTimer}s</p>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="bg-indigo hover:bg-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {t('generateButton')}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-heading font-semibold mb-4">Something went wrong</h3>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleRetry}
                      className="bg-indigo hover:bg-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {t('generateButton')}
                    </button>
                    <button
                      onClick={handleBackToSelection}
                      className="bg-card border border-border hover:bg-border px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {t('backToSelection')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16 py-8 text-center text-gray-500 text-sm">
          <p>{t('footer')}</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
