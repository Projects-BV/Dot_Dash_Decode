import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// Comprehensive Morse code translation data for all 26 letters
const morseCodeData = [
  { 
    letter: 'A', 
    morse: '.-', 
    color: 'bg-red-100',
    textColor: 'text-red-700',
    description: 'Alpha: First letter in the alphabet'
  },
  { 
    letter: 'B', 
    morse: '-...', 
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    description: 'Bravo: Begins with a long signal'
  },
  { 
    letter: 'C', 
    morse: '-.-.', 
    color: 'bg-green-100',
    textColor: 'text-green-700',
    description: 'Charlie: Alternating short and long signals'
  },
  { 
    letter: 'D', 
    morse: '-..', 
    color: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    description: 'Delta: Starts with a long signal'
  },
  { 
    letter: 'E', 
    morse: '.', 
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
    description: 'Echo: Shortest Morse code letter'
  },
  { 
    letter: 'F', 
    morse: '..-.', 
    color: 'bg-pink-100',
    textColor: 'text-pink-700',
    description: 'Foxtrot: Two short signals, long and short'
  },
  { 
    letter: 'G', 
    morse: '--.', 
    color: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    description: 'Golf: Two long signals and a short'
  },
  { 
    letter: 'H', 
    morse: '....', 
    color: 'bg-teal-100',
    textColor: 'text-teal-700',
    description: 'Hotel: Four short signals'
  },
  { 
    letter: 'I', 
    morse: '..', 
    color: 'bg-orange-100',
    textColor: 'text-orange-700',
    description: 'India: Two short signals'
  },
  { 
    letter: 'J', 
    morse: '.---', 
    color: 'bg-cyan-100',
    textColor: 'text-cyan-700',
    description: 'Juliet: Short signal followed by three long'
  },
  { 
    letter: 'K', 
    morse: '-.-', 
    color: 'bg-lime-100',
    textColor: 'text-lime-700',
    description: 'Kilo: Long-short-long pattern'
  },
  { 
    letter: 'L', 
    morse: '.-..', 
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
    description: 'Lima: Short-long-short signal'
  },
  { 
    letter: 'M', 
    morse: '--', 
    color: 'bg-rose-100',
    textColor: 'text-rose-700',
    description: 'Mike: Two long signals'
  },
  { 
    letter: 'N', 
    morse: '-.', 
    color: 'bg-sky-100',
    textColor: 'text-sky-700',
    description: 'November: Long-short pattern'
  },
  { 
    letter: 'O', 
    morse: '---', 
    color: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    description: 'Oscar: Three long signals'
  },
  { 
    letter: 'P', 
    morse: '.--.', 
    color: 'bg-fuchsia-100',
    textColor: 'text-fuchsia-700',
    description: 'Papa: Short-long-long-short pattern'
  },
  { 
    letter: 'Q', 
    morse: '--.-', 
    color: 'bg-stone-100',
    textColor: 'text-stone-700',
    description: 'Quebec: Long-long-short-long pattern'
  },
  { 
    letter: 'R', 
    morse: '.-.', 
    color: 'bg-violet-100',
    textColor: 'text-violet-700',
    description: 'Romeo: Short-long-short pattern'
  },
  { 
    letter: 'S', 
    morse: '...', 
    color: 'bg-blue-200',
    textColor: 'text-blue-800',
    description: 'Sierra: Three short signals'
  },
  { 
    letter: 'T', 
    morse: '-', 
    color: 'bg-green-200',
    textColor: 'text-green-800',
    description: 'Tango: Single long signal'
  },
  { 
    letter: 'U', 
    morse: '..-', 
    color: 'bg-red-200',
    textColor: 'text-red-800',
    description: 'Uniform: Two short signals and a long'
  },
  { 
    letter: 'V', 
    morse: '...-', 
    color: 'bg-yellow-200',
    textColor: 'text-yellow-800',
    description: 'Victor: Three short signals and a long'
  },
  { 
    letter: 'W', 
    morse: '.--', 
    color: 'bg-purple-200',
    textColor: 'text-purple-800',
    description: 'Whiskey: Short signal followed by two long'
  },
  { 
    letter: 'X', 
    morse: '-..-', 
    color: 'bg-pink-200',
    textColor: 'text-pink-800',
    description: 'X-ray: Long-short-short-long pattern'
  },
  { 
    letter: 'Y', 
    morse: '-.--', 
    color: 'bg-indigo-200',
    textColor: 'text-indigo-800',
    description: 'Yankee: Long-short-long-long pattern'
  },
  { 
    letter: 'Z', 
    morse: '--..', 
    color: 'bg-orange-200',
    textColor: 'text-orange-800',
    description: 'Zulu: Two long signals followed by two short'
  },
  { letter: '0', morse: '-----', color: 'bg-gray-200', textColor: 'text-gray-800', description: 'Zero: Five long signals' },
  { letter: '1', morse: '.----', color: 'bg-red-200', textColor: 'text-red-800', description: 'One: One short, four long signals' },
  { letter: '2', morse: '..---', color: 'bg-yellow-200', textColor: 'text-yellow-800', description: 'Two: Two short, three long signals' },
  { letter: '3', morse: '...--', color: 'bg-green-200', textColor: 'text-green-800', description: 'Three: Three short, two long signals' },
  { letter: '4', morse: '....-', color: 'bg-blue-200', textColor: 'text-blue-800', description: 'Four: Four short, one long signal' },
  { letter: '5', morse: '.....', color: 'bg-indigo-200', textColor: 'text-indigo-800', description: 'Five: Five short signals' },
  { letter: '6', morse: '-....', color: 'bg-purple-200', textColor: 'text-purple-800', description: 'Six: One long, four short signals' },
  { letter: '7', morse: '--...', color: 'bg-pink-200', textColor: 'text-pink-800', description: 'Seven: Two long, three short signals' },
  { letter: '8', morse: '---..', color: 'bg-rose-200', textColor: 'text-rose-800', description: 'Eight: Three long, two short signals' },
  { letter: '9', morse: '----.', color: 'bg-amber-200', textColor: 'text-amber-800', description: 'Nine: Four long, one short signal' }
];

const MorseCodeEyeFlashcards = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
  
    const resetCard = () => {
      setIsFlipped(false);
    };
  
    const navigateCard = (direction) => {
      resetCard();
      
      if (direction === 'next') {
        setCurrentCardIndex((prevIndex) => 
          prevIndex < morseCodeData.length - 1 ? prevIndex + 1 : 0
        );
      } else {
        setCurrentCardIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : morseCodeData.length - 1
        );
      }
    };
  
    const currentCard = morseCodeData[currentCardIndex];
  
    return (
      <div className="morse-tutorial-container">
        <div className="morse-tutorial-card">
          <div className={`flashcard ${currentCard.color}`}>
            <div className={`letter-display ${currentCard.textColor}`}>
              {currentCard.letter}
            </div>

            <div className="card-content">
              <div className={`morse-code ${currentCard.textColor}`}>
                {currentCard.morse}
              </div>
              {isFlipped && (
                <div className={`description ${currentCard.textColor}`}>
                  {currentCard.description}
                </div>
              )}
            </div>
  
            {/* Navigation */}
            <div className="card-navigation">
              <button 
                onClick={() => navigateCard('prev')}
                className="nav-button"
              >
                Previous
              </button>
              <div className="card-counter">
                Card {currentCardIndex + 1} of {morseCodeData.length}
              </div>
              <button 
                onClick={() => navigateCard('next')}
                className="nav-button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default MorseCodeEyeFlashcards;
