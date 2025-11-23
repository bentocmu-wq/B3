import { SHEET_ID, FALLBACK_DATA } from './constants';
import { SheetData } from './types';

export const fetchSheetData = async (): Promise<SheetData> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      console.warn('Could not fetch live sheet, using fallback data.');
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