import React, { useState, useEffect, useRef } from 'react';

export default function VoiceRecorder({ language, onVoiceComplete, t, isChrome, category, onSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const languageRef = useRef(language);

  // Keep language ref updated
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Initialize speech recognition
  useEffect(() => {
    if (!isChrome) {
      setError('chrome');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('notsupported');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    // Set language based on current selection - Telugu or English
    recognitionInstance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    recognitionInstance.maxAlternatives = 1;

    console.log('Speech recognition initialized with language:', recognitionInstance.lang);

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => {
          const newText = prev + finalTranscript;
          console.log('Telugu/English transcript:', newText);
          return newText;
        });
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('permission');
      } else if (event.error === 'language-not-supported') {
        console.log('Telugu language may not be fully supported on this device. Try speaking in English or use text input.');
      }
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      console.log('Recognition ended');
    };

    recognitionRef.current = recognitionInstance;
    setRecognition(recognitionInstance);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isChrome]);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      if (transcript.trim()) {
        onVoiceComplete(transcript.trim());
      }
    } else {
      // Update language before starting - supports both Telugu and English
      recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
      console.log('Starting recognition with language:', recognition.lang, '(Telugu/English)');

      setTranscript('');
      setError(null);
      recognition.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (recognitionRef.current && isRecording) {
          recognitionRef.current.stop();
          setIsRecording(false);
        }
      }, 60000);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setError(null);
  };

  const handleSubmit = () => {
    if (transcript.trim() && onSubmit) {
      onVoiceComplete(transcript.trim());
      onSubmit({ ...{ text: transcript.trim() } });
    }
  };

  if (error === 'chrome' || error === 'notsupported') {
    return (
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-300 mb-4 telugu-text">{t('chromeWarning')}</p>
        </div>
      </div>
    );
  }

  if (error === 'permission') {
    return (
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-gray-300 mb-4 telugu-text">
            Microphone permission denied. Please enable microphone access in Chrome settings and try again.
          </p>
          <button
            onClick={handleReset}
            className="bg-indigo hover:bg-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="max-w-2xl mx-auto">
        {/* Language indicator */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 text-sm text-indigo-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {language === 'te' ? 'తెలుగు (Telugu)' : 'English'} recognition active
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Speak in Telugu or English - AI will understand both
          </p>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleRecording}
            disabled={!recognition}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 pulse-red'
                : 'bg-indigo hover:bg-indigo-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <div className="flex items-end gap-1 h-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-2 bg-white rounded-full wave-bar"
                    style={{ animationDelay: `${(i - 1) * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <span className="text-4xl">🎤</span>
            )}
          </button>
        </div>

        {/* Status Text */}
        <p className="text-center text-lg mb-6 telugu-text">
          {isRecording ? t('micRecording') : transcript ? t('micDone') : t('micIdle')}
        </p>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-navy rounded-lg p-4 mb-6">
            <p className="text-gray-300 telugu-text whitespace-pre-wrap">{transcript}</p>
          </div>
        )}

        {/* Warning for short transcript */}
        {transcript && transcript.length < 50 && (
          <p className="text-amber-400 text-center text-sm mb-4 telugu-text">
            Please describe your problem in more detail (at least 50 characters).
          </p>
        )}

        {/* Action Buttons */}
        {transcript && !isRecording && (
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-card border border-border hover:bg-border px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('recordAgain')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={transcript.length < 50}
              className="flex-1 bg-indigo hover:bg-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('generateButton')}
            </button>
          </div>
        )}

        {/* Placeholder when empty */}
        {!transcript && !isRecording && (
          <p className="text-center text-gray-500 telugu-text">{t('transcriptPlaceholder')}</p>
        )}
      </div>
    </div>
  );
}
