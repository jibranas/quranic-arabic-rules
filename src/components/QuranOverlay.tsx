import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuranWord {
  id: string
  text: string
}

interface QuranLine {
  pageNumber: number
  lineNumber: number
  lineType: 'surah_name' | 'basmallah' | 'ayah'
  isCentered: boolean
  firstWordId: string
  lastWordId: string
  surahNumber: number | null
  words: QuranWord[]
}

interface QuranPage {
  pageNumber: number
  lines: QuranLine[]
}

export function QuranOverlay() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageData, setPageData] = useState<QuranPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allWords, setAllWords] = useState<Map<string, QuranWord>>(new Map())

  // Fetch all words once
  useEffect(() => {
    const fetchWords = async () => {
      try {
        console.log('Fetching words...');
        const response = await fetch('/api/quran-words');
        const data = await response.json();
        
        if (response.ok) {
          // Create a map of WordId to array of word segments
          const wordSegments = new Map<string, any[]>();
          
          data.words.forEach((word: any) => {
            const wordId = word.WordId;
            if (!wordSegments.has(wordId)) {
              wordSegments.set(wordId, []);
            }
            wordSegments.get(wordId)?.push(word);
          });

          // Convert segments to complete words
          const wordMap = new Map<string, QuranWord>();
          wordSegments.forEach((segments, wordId) => {
            // Sort segments by SegmentNo
            const sortedSegments = segments.sort((a: any, b: any) => 
              parseInt(a.SegmentNo) - parseInt(b.SegmentNo)
            );
            
            // Combine segments into a single word
            const text = sortedSegments.map((s: any) => s.Text).join('');
            wordMap.set(wordId, {
              id: wordId,
              text: text
            });
          });

          console.log('Word map created with size:', wordMap.size);
          console.log('Sample word:', wordMap.get('1'));
          setAllWords(wordMap);
        } else {
          setError(data.error || 'Failed to fetch words');
        }
      } catch (err) {
        console.error('Error fetching words:', err);
        setError('Failed to fetch words');
      }
    };

    fetchWords();
  }, []);

  // Fetch page data when page changes
  useEffect(() => {
    const fetchPageData = async () => {
      if (allWords.size === 0) {
        console.log('Waiting for words to load...');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch('/api/quran-pages');
        const data = await response.json();
        
        if (response.ok) {
          const pageLines = data.pages
            .filter((line: any) => line.page_number === currentPage.toString())
            .map((line: any) => {
              // Handle lines with no word IDs (like surah names)
              if (!line.first_word_id || !line.last_word_id) {
                return {
                  pageNumber: parseInt(line.page_number),
                  lineNumber: parseInt(line.line_number),
                  lineType: line.line_type as 'surah_name' | 'basmallah' | 'ayah',
                  isCentered: line.is_centered === '1',
                  firstWordId: line.first_word_id,
                  lastWordId: line.last_word_id,
                  surahNumber: line.surah_number ? parseInt(line.surah_number) : null,
                  words: []
                };
              }

              // For lines with word IDs, get the words
              const words: QuranWord[] = [];
              const firstId = parseInt(line.first_word_id);
              const lastId = parseInt(line.last_word_id);
              
              for (let wordId = firstId; wordId <= lastId; wordId++) {
                const word = allWords.get(wordId.toString());
                if (word) {
                  words.push(word);
                }
              }

              return {
                pageNumber: parseInt(line.page_number),
                lineNumber: parseInt(line.line_number),
                lineType: line.line_type as 'surah_name' | 'basmallah' | 'ayah',
                isCentered: line.is_centered === '1',
                firstWordId: line.first_word_id,
                lastWordId: line.last_word_id,
                surahNumber: line.surah_number ? parseInt(line.surah_number) : null,
                words
              };
            });

          console.log('Processed page lines:', pageLines);
          setPageData({
            pageNumber: currentPage,
            lines: pageLines
          });
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch page data');
        }
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to fetch page data');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [currentPage, allWords]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="relative h-full bg-gray-50">
      {/* Header with tabs */}
      <div className="flex justify-center space-x-8 p-4 bg-white border-b">
        <button className="text-gray-500 hover:text-gray-700">Contents</button>
        <button className="text-gray-500 hover:text-gray-700">Learn</button>
        <button className="text-gray-500 hover:text-gray-700">Words</button>
      </div>

      {/* Page title and navigation */}
      <div className="flex items-center justify-between p-4 max-w-3xl mx-auto">
        <button
          onClick={handlePreviousPage}
          className="flex items-center text-gray-600 hover:text-gray-800"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        
        <h1 className="text-xl font-medium">Page {currentPage}</h1>
        
        <button
          onClick={handleNextPage}
          className="flex items-center text-gray-600 hover:text-gray-800"
          disabled={currentPage === 604}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-lg">Loading page {currentPage}...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      ) : (
        /* Page content */
        <div className="p-6 max-w-3xl mx-auto bg-[#fcf6eb] min-h-[calc(100vh-200px)] rounded-lg">
          {pageData?.lines.map((line, index) => (
            <div
              key={`${line.pageNumber}-${line.lineNumber}`}
              className={`mb-6 ${
                line.isCentered ? 'text-center' : 'text-right'
              } ${
                line.lineType === 'surah_name' ? 'text-xl font-bold' : ''
              } ${
                line.lineType === 'basmallah' ? 'text-lg text-emerald-600' : ''
              }`}
            >
              {line.words.map((word, wordIndex) => (
                <span
                  key={`${word.id}-${wordIndex}`}
                  className="font-arabic text-3xl mx-1 leading-loose"
                >
                  {word.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 