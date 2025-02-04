import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2 } from 'lucide-react';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    surah: string;
    ayah: number;
    highlightText: string;
  };
}

const getSurahNumber = (surahName: string): number => {
  // If it's already a number
  if (!isNaN(Number(surahName))) {
    return Number(surahName);
  }

  // If the surah name contains numbers (e.g., "Al-Baqarah-2")
  const numberMatch = surahName.match(/\d+/);
  if (numberMatch) {
    return Number(numberMatch[0]);
  }

  // Full mapping of all 114 surahs
  const surahMap: { [key: string]: number } = {
    'Al-Fatihah': 1,
    'Al-Baqarah': 2,
    'Al-Imran': 3,
    'An-Nisa': 4,
    'Al-Maidah': 5,
    'Al-Anam': 6,
    'Al-Araf': 7,
    'Al-Anfal': 8,
    'At-Tawbah': 9,
    'Yunus': 10,
    'Hud': 11,
    'Yusuf': 12,
    'Ar-Rad': 13,
    'Ibrahim': 14,
    'Al-Hijr': 15,
    'An-Nahl': 16,
    'Al-Isra': 17,
    'Al-Kahf': 18,
    'Maryam': 19,
    'Ta-Ha': 20,
    'Al-Anbiya': 21,
    'Al-Hajj': 22,
    'Al-Muminun': 23,
    'An-Nur': 24,
    'Al-Furqan': 25,
    'Ash-Shuara': 26,
    'An-Naml': 27,
    'Al-Qasas': 28,
    'Al-Ankabut': 29,
    'Ar-Rum': 30,
    'Luqman': 31,
    'As-Sajdah': 32,
    'Al-Ahzab': 33,
    'Saba': 34,
    'Fatir': 35,
    'Ya-Sin': 36,
    'As-Saffat': 37,
    'Sad': 38,
    'Az-Zumar': 39,
    'Ghafir': 40,
    'Fussilat': 41,
    'Ash-Shura': 42,
    'Az-Zukhruf': 43,
    'Ad-Dukhan': 44,
    'Al-Jathiyah': 45,
    'Al-Ahqaf': 46,
    'Muhammad': 47,
    'Al-Fath': 48,
    'Al-Hujurat': 49,
    'Qaf': 50,
    'Adh-Dhariyat': 51,
    'At-Tur': 52,
    'An-Najm': 53,
    'Al-Qamar': 54,
    'Ar-Rahman': 55,
    'Al-Waqiah': 56,
    'Al-Hadid': 57,
    'Al-Mujadila': 58,
    'Al-Hashr': 59,
    'Al-Mumtahanah': 60,
    'As-Saf': 61,
    'Al-Jumuah': 62,
    'Al-Munafiqun': 63,
    'At-Taghabun': 64,
    'At-Talaq': 65,
    'At-Tahrim': 66,
    'Al-Mulk': 67,
    'Al-Qalam': 68,
    'Al-Haqqah': 69,
    'Al-Maarij': 70,
    'Nuh': 71,
    'Al-Jinn': 72,
    'Al-Muzzammil': 73,
    'Al-Muddaththir': 74,
    'Al-Qiyamah': 75,
    'Al-Insan': 76,
    'Al-Mursalat': 77,
    'An-Naba': 78,
    'An-Naziat': 79,
    'Abasa': 80,
    'At-Takwir': 81,
    'Al-Infitar': 82,
    'Al-Mutaffifin': 83,
    'Al-Inshiqaq': 84,
    'Al-Buruj': 85,
    'At-Tariq': 86,
    'Al-Ala': 87,
    'Al-Ghashiyah': 88,
    'Al-Fajr': 89,
    'Al-Balad': 90,
    'Ash-Shams': 91,
    'Al-Lail': 92,
    'Ad-Duha': 93,
    'Ash-Sharh': 94,
    'At-Tin': 95,
    'Al-Alaq': 96,
    'Al-Qadr': 97,
    'Al-Bayyinah': 98,
    'Az-Zalzalah': 99,
    'Al-Adiyat': 100,
    'Al-Qariah': 101,
    'At-Takathur': 102,
    'Al-Asr': 103,
    'Al-Humazah': 104,
    'Al-Fil': 105,
    'Quraish': 106,
    'Al-Maun': 107,
    'Al-Kawthar': 108,
    'Al-Kafirun': 109,
    'An-Nasr': 110,
    'Al-Masad': 111,
    'Al-Ikhlas': 112,
    'Al-Falaq': 113,
    'An-Nas': 114
  };

  // Try to find the surah number by name
  for (const [name, number] of Object.entries(surahMap)) {
    // Case insensitive comparison and handle different formats of the same name
    if (surahName.toLowerCase().replace(/[^a-z]/g, '') === name.toLowerCase().replace(/[^a-z]/g, '')) {
      return number;
    }
  }

  console.warn(`Could not find surah number for: ${surahName}`);
  return 1; // Default to Al-Fatihah if not found
};

export function VerseModal({ isOpen, onClose, verse }: VerseModalProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [verseDetails, setVerseDetails] = React.useState<{ arabic: string; translation: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset playback position
      audioRef.current.src = ''; // Clear the source
      audioRef.current = null;
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      cleanupAudio();
      onClose();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);

      const loadVerseAndAudio = async () => {
        try {
          const surahNumber = getSurahNumber(verse.surah);
          
          // Fetch verse text from API
          const response = await fetch(`https://quranenc.com/api/v1/translation/aya/english_hilali_khan/${surahNumber}/${verse.ayah}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error('Failed to fetch verse');
          }

          // Extract verse details from API response
          const details = {
            arabic: data.result.arabic_text,
            translation: data.result.translation.replace(/^\s*\d+\.\s*/, '') // Remove verse number from translation
          };
          
          // Set verse details and stop loading immediately after fetch
          setVerseDetails(details);
          setIsLoading(false);

          // Handle audio separately
          const audioUrl = `https://quranaudio.pages.dev/2/${surahNumber}_${verse.ayah}.mp3`;

          // Clean up any existing audio first
          cleanupAudio();
          
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.addEventListener('canplaythrough', () => {
            if (audioRef.current === audio) {
              audio.play().catch(error => console.log('Audio playback failed:', error));
            }
          });

          audio.addEventListener('error', (e) => {
            console.warn(`Audio failed to load:`, e);
            if (audioRef.current === audio) {
              audioRef.current = null;
            }
          });

        } catch (error) {
          console.error('Error loading verse:', error);
          setError('Failed to load verse. Please try again later.');
          setIsLoading(false);
        }
      };

      loadVerseAndAudio();
      return cleanupAudio;
    }
  }, [isOpen, verse.surah, verse.ayah]);

  const highlightWord = (text: string, wordToHighlight: string) => {
    // For debugging
    console.log('Full text:', text);
    console.log('Word to highlight:', wordToHighlight);

    // Enhanced normalization function
    const normalizeArabic = (str: string) => {
      return str
        // Remove diacritics and special marks
        .replace(/[\u064B-\u065F]/g, '')         // Remove tashkeel (diacritics)
        .replace(/[\u0670-\u0674]/g, '')         // Remove superscript alef
        .replace(/[\u06D6-\u06ED]/g, '')         // Remove other arabic marks
        .replace(/[\u0640]/g, '')                // Remove tatweel
        .replace(/[ۚۖۛۗۙۥ]/g, '')                 // Remove other marks
        
        // Normalize alef variations
        .replace(/[أإآاٱى]/g, 'ا')               // Normalize alef variations
        .replace(/ٰ/g, 'ا')                      // Replace small alef with regular alef
        
        // Normalize other letters
        .replace(/[ة]/g, 'ه')                    // Normalize taa marbouta
        .replace(/[ي]/g, 'ى')                    // Normalize yaa
        .replace(/[ؤئ]/g, 'ء')                   // Normalize hamza
        
        // Handle special cases
        .replace(/لله/g, 'الله')                 // Fix Allah word normalization
        .replace(/ٱ/g, 'ا')                      // Replace hamza wasl with alef
        .replace(/ٓ/g, '')                       // Remove madda
        
        // Clean up spaces and duplicates
        .replace(/\s+/g, ' ')                    // Normalize spaces
        .replace(/ا+/g, 'ا')                     // Replace multiple alefs
        .trim();
    };

    // Normalize both text and word to highlight
    const normalizedText = normalizeArabic(text);
    const normalizedWord = normalizeArabic(wordToHighlight);

    console.log('Normalized text:', normalizedText);
    console.log('Normalized word:', normalizedWord);

    // Split into words and normalize each
    const words = text.split(/\s+/);
    const normalizedWords = words.map(w => normalizeArabic(w));
    const targetWords = wordToHighlight.split(/\s+/).map(w => normalizeArabic(w));

    console.log('Normalized words array:', normalizedWords);
    console.log('Target words array:', targetWords);
    
    // Find the matching sequence
    let matchStart = -1;
    for (let i = 0; i < normalizedWords.length - targetWords.length + 1; i++) {
      const potentialMatch = normalizedWords.slice(i, i + targetWords.length);
      console.log(`Checking words at position ${i}:`, potentialMatch);
      if (targetWords.every((w, j) => normalizedWords[i + j].includes(w) || w.includes(normalizedWords[i + j]))) {
        matchStart = i;
        console.log('Found match at position:', i);
        break;
      }
    }

    if (matchStart === -1) {
      console.log('No match found');
      return <>{text}</>;
    }

    // Get the original words with all diacritics
    const originalPhrase = words.slice(matchStart, matchStart + targetWords.length).join(' ');
    console.log('Original phrase to highlight:', originalPhrase);
    
    // Split and highlight
    const parts = text.split(originalPhrase);
    
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="bg-yellow-200 px-1 rounded">
                {originalPhrase}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Add console.log for debugging in the render section
  console.log('Current verseDetails:', verseDetails);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Surah {verse.surah}, Ayah {verse.ayah}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={playAudio}
              disabled={!audioRef.current}
              className="h-8 w-8"
              title="Play Audio"
            >
              <Volume2 className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <>
              {verseDetails && (
                <>
                  <p className="text-2xl text-right font-arabic leading-loose">
                    {verseDetails.arabic && highlightWord(verseDetails.arabic, verse.highlightText)}
                  </p>
                  <p className="text-gray-600">
                    {verseDetails.translation}
                  </p>
                </>
              )}
              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 