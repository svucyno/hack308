import express from 'express';
import { callGemini, parseGeminiJSON } from '../lib/gemini.js';
import { classifyPrompt, categoryPrompts } from '../prompts/systemPrompts.js';

const router = express.Router();

const defaultClassification = {
  grievance_category: 'CONSUMER',
  grievance_subcategory: 'General Consumer Complaint',
  urgency: 'NORMAL',
  applicable_laws: ['Consumer Protection Act 2019'],
  filing_authority: 'District Consumer Disputes Redressal Commission',
  filing_portal: 'https://edistrict.ap.gov.in',
  time_limit_to_file: 'Within 2 years from cause of action',
  confidence: 'MEDIUM',
};

router.post('/classify', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.json(defaultClassification);
    }

    const response = await callGemini(classifyPrompt, text, 500);
    const classification = parseGeminiJSON(response);

    res.json(classification);
  } catch (error) {
    console.error('Classification error:', error.message);
    // Return default on any error to keep app working
    res.json(defaultClassification);
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { text, name, date, address, against, category } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Complaint text is required' });
    }

    const systemPrompt = categoryPrompts[category] || categoryPrompts.CIVIL;

    const userMessage = `
Complaint Details:
- Problem: ${text}
- Complainant Name: ${name || 'Not provided'}
- Date of Incident: ${date || 'Not specified'}
- Address: ${address || 'Not provided'}
- Against: ${against || 'Not specified'}
- Category: ${category}

Generate the complete legal letter in formal English. If the complaint above is in Telugu, understand it and generate the letter in formal English.`;

    const response = await callGemini(systemPrompt, userMessage, 3000);
    const letterData = parseGeminiJSON(response);

    res.json(letterData);
  } catch (error) {
    console.error('Generation error:', error.message);

    if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RATE_LIMIT')) {
      return res.status(429).json({ error: 'RATE_LIMIT' });
    }

    res.status(500).json({ error: 'Failed to generate letter' });
  }
});

export default router;
