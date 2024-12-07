import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    arabic: string;
    translation: string;
    surah: string;
    ayah: number;
    highlightText: string;
  };
}

export function VerseModal({ isOpen, onClose, verse }: VerseModalProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const handleClose = () => {
    cleanupAudio();
    onClose();
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const surahNumber = getSurahNumber(verse.surah);
      
      // Format the audio URL according to the specified pattern
      const audioUrl = `https://quranaudio.pages.dev/2/${surahNumber}_${verse.ayah}.mp3`;
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false);
        audio.play();
      });

      audio.addEventListener('error', (e) => {
        setIsLoading(false);
        console.error('Error loading audio:', e);
      });

      audioRef.current = audio;

      return cleanupAudio;
    }
  }, [isOpen, verse.surah, verse.ayah]);

  // Function to highlight the specific word in the verse
  const highlightWord = (text: string, wordToHighlight: string) => {
    // For debugging
    console.log('Full text:', text);
    console.log('Word to highlight:', wordToHighlight);

    // Normalize both strings by removing diacritics and special characters
    const normalizeArabic = (str: string) => {
      return str
        .replace(/[\u064B-\u065F]/g, '') // Remove tashkeel (diacritics)
        .replace(/\u0640/g, '')          // Remove tatweel
        .replace(/[\u0670-\u0674]/g, '') // Remove superscript alef
        .replace(/[ىئءؤإأٱآا]/g, 'ا')     // Normalize all alef forms first
        .replace(/ة/g, 'ه')              // Normalize taa marbouta
        .replace(/[ۚۖۛۗ]/g, '')          // Remove other marks
        .replace(/\s+/g, ' ')            // Normalize spaces
        .replace(/لله/g, 'الله')         // Fix Allah word normalization
        .replace(/ا+/g, 'ا')             // Replace multiple alefs with single alef
        .trim();
    };

    const normalizedText = normalizeArabic(text);
    const normalizedWord = normalizeArabic(wordToHighlight);

    console.log('Normalized text:', normalizedText);
    console.log('Normalized word:', normalizedWord);

    // Find the word boundaries in the original text
    const words = text.split(/\s+/);
    const normalizedWords = words.map(w => normalizeArabic(w));
    const targetWords = wordToHighlight.split(/\s+/).map(w => normalizeArabic(w));
    
    let matchStart = -1;
    for (let i = 0; i < normalizedWords.length - targetWords.length + 1; i++) {
      if (targetWords.every((w, j) => normalizedWords[i + j] === w)) {
        matchStart = i;
        break;
      }
    }

    if (matchStart === -1) return <>{text}</>;

    // Get the original words with all diacritics
    const originalPhrase = words.slice(matchStart, matchStart + targetWords.length).join(' ');
    
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Surah {verse.surah}, Ayah {verse.ayah}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={playAudio}
              disabled={isLoading}
              className="h-8 w-8"
              title="Play Audio"
            >
              <Volume2 className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-2xl text-right font-arabic leading-loose">
            {highlightWord(verse.arabic, verse.highlightText)}
          </p>
          <p className="text-gray-600">
            {verse.translation}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Updated surah mapping
function getSurahNumber(surahName: string): number {
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

  return surahMap[surahName] || 1;
} 