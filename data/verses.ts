export interface VerseDetail {
  arabic: string;
  translation: string;
}

export interface VerseDetails {
  [key: string]: VerseDetail;
}

export async function fetchVerse(surah: string, ayah: number): Promise<VerseDetail> {
  try {
    const response = await fetch(`https://quranenc.com/api/v1/translation/aya/english_hilali_khan/${surah}/${ayah}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to fetch verse');
    }

    return {
      arabic: data.result.arabic_text,
      translation: data.result.translation.replace(/^\s*\d+\.\s*/, '') // Remove verse number from translation
    };
  } catch (error) {
    console.error('Error fetching verse:', error);
    // Return empty strings or throw error based on your error handling preference
    return {
      arabic: '',
      translation: ''
    };
  }
} 