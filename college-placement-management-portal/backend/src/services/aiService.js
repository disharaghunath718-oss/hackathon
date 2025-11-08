
import fs from 'fs';
import fetch from 'node-fetch';

/**
 * Gemini AI placeholder integration.
 * Expects GEMINI_API_KEY in env. This implementation reads the uploaded file (if text)
 * and creates a VERY simple parse. For production, replace with actual call to
 * Google's Generative API (Gemini) and/or OCR for PDFs.
 */

const parseResume = async (filePath) => {
  try {
    if (!filePath) return { raw: '' };
    // if it's a text file, read text; otherwise return raw filename
    if (fs.existsSync(filePath)) {
      const ext = filePath.split('.').pop().toLowerCase();
      if (ext === 'txt') {
        const txt = fs.readFileSync(filePath, 'utf-8');
        // very naive extraction
        const emails = txt.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g) || [];
        const lines = txt.split('\n').map(l => l.trim()).filter(Boolean);
        const skills = lines.filter(l => l.toLowerCase().includes('skills')).flatMap(l => l.split(/:|,|\|/).slice(1)).map(s=>s?.trim()).filter(Boolean);
        return { rawText: txt, emails, skills };
      } else {
        // For PDFs or others, return filename and call to Gemini if configured (placeholder)
        return { rawFilename: filePath };
      }
    }
    return { raw: 'file-not-found' };
  } catch (err) {
    return { error: err.message };
  }
};

const scoreResume = async (parsed, driveId) => {
  // simple heuristic scoring: skills count * 20
  const skills = parsed.skills || [];
  const score = Math.min(100, (skills.length * 20));
  return score;
};

export default { parseResume, scoreResume };
