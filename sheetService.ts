import { SHEET_ID, FALLBACK_DATA } from '../constants';
import { SheetData } from '../types';

/**
 * Attempts to fetch the Google Sheet as CSV.
 * Since browsers block CORS for direct Google Sheet CSV fetching usually,
 * this is designed to fail gracefully and fallback to mock data for the demo to function.
 */
export const fetchSheetData = async (): Promise<SheetData> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      // headers: { 'Content-Type': 'text/csv' } // Often causes preflight failure on GSheets
    });

    if (!response.ok) {
      console.warn('Could not fetch live sheet (likely private or CORS), using fallback data.');
      return { content: FALLBACK_DATA, source: 'FALLBACK' };
    }

    const text = await response.text();
    
    if (!text || text.length < 10) {
       return { content: FALLBACK_DATA, source: 'FALLBACK' };
    }

    return { content: text, source: 'LIVE' };

  } catch (error) {
    console.warn('Error fetching sheet, using fallback data:', error);
    return { content: FALLBACK_DATA, source: 'FALLBACK' };
  }
};