import React, { useState, useEffect, useRef } from 'react';
import { Eye, Zap, RefreshCw, CheckCircle, XCircle } from 'lucide-react';



// Comprehensive Morse code translation data
const morseCodeData = [
  { 
    letter: 'A', 
    morse: '.-', 
    eyeDetectionPattern: 'short-long',
    color: 'bg-red-100',
    textColor: 'text-red-700',
    description: 'Alpha: Quick glance followed by sustained look'
  },
  { 
    letter: 'B', 
    morse: '-...', 
    eyeDetectionPattern: 'long-short-short-short',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    description: 'Bravo: Sustained look, then three quick glances'
  },
  { 
    letter: 'C', 
    morse: '-.-.', 
    eyeDetectionPattern: 'long-short-long-short',
    color: 'bg-green-100',
    textColor: 'text-green-700',
    description: 'Charlie: Alternating sustained and quick looks'
  },
  { 
    letter: 'D', 
    morse: '-..', 
    eyeDetectionPattern: 'long-short-short',
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
    description: 'Delta: Sustained look, two quick glances'
  },
  { 
    letter: 'E', 
    morse: '.', 
    eyeDetectionPattern: 'short',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    description: 'Echo: Quick single glance'
  },
  { 
    letter: 'F', 
    morse: '..-.', 
    eyeDetectionPattern: 'short-short-long-short',
    color: 'bg-pink-100',
    textColor: 'text-pink-700',
    description: 'Foxtrot: Two quick glances, sustained, quick glance'
  },
  { 
    letter: 'G', 
    morse: '--.', 
    eyeDetectionPattern: 'long-long-short',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    description: 'Golf: Two sustained looks, quick glance'
  },
  { 
    letter: 'H', 
    morse: '....', 
    eyeDetectionPattern: 'short-short-short-short',
    color: 'bg-cyan-100',
    textColor: 'text-cyan-700',
    description: 'Hotel: Four quick glances'
  },
  { 
    letter: 'I', 
    morse: '..', 
    eyeDetectionPattern: 'short-short',
    color: 'bg-orange-100',
    textColor: 'text-orange-700',
    description: 'India: Two quick glances'
  },
  { 
    letter: 'J', 
    morse: '.---', 
    eyeDetectionPattern: 'short-long-long-long',
    color: 'bg-teal-100',
    textColor: 'text-teal-700',
    description: 'Juliet: Quick glance, three sustained looks'
  },
  { 
    letter: 'K', 
    morse: '-.-', 
    eyeDetectionPattern: 'long-short-long',
    color: 'bg-rose-100',
    textColor: 'text-rose-700',
    description: 'Kilo: Sustained, quick, sustained look'
  },
  { 
    letter: 'L', 
    morse: '.-..', 
    eyeDetectionPattern: 'short-long-short-short',
    color: 'bg-lime-100',
    textColor: 'text-lime-700',
    description: 'Lima: Quick, sustained, two quick glances'
  },
  { 
    letter: 'M', 
    morse: '--', 
    eyeDetectionPattern: 'long-long',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    description: 'Mike: Two sustained looks'
  },
  { 
    letter: 'N', 
    morse: '-.', 
    eyeDetectionPattern: 'long-short',
    color: 'bg-sky-100',
    textColor: 'text-sky-700',
    description: 'November: Sustained, quick glance'
  },
  { 
    letter: 'O', 
    morse: '---', 
    eyeDetectionPattern: 'long-long-long',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
    description: 'Oscar: Three sustained looks'
  },
  { 
    letter: 'P', 
    morse: '.--.', 
    eyeDetectionPattern: 'short-long-long-short',
    color: 'bg-fuchsia-100',
    textColor: 'text-fuchsia-700',
    description: 'Papa: Quick, sustained, sustained, quick glance'
  },
  { 
    letter: 'Q', 
    morse: '--.-', 
    eyeDetectionPattern: 'long-long-short-long',
    color: 'bg-violet-100',
    textColor: 'text-violet-700',
    description: 'Quebec: Two sustained, quick, sustained look'
  },
  { 
    letter: 'R', 
    morse: '.-.', 
    eyeDetectionPattern: 'short-long-short',
    color: 'bg-stone-100',
    textColor: 'text-stone-700',
    description: 'Romeo: Quick, sustained, quick glance'
  },
  { 
    letter: 'S', 
    morse: '...', 
    eyeDetectionPattern: 'short-short-short',
    color: 'bg-blue-200',
    textColor: 'text-blue-800',
    description: 'Sierra: Three quick glances'
  },
  { 
    letter: 'T', 
    morse: '-', 
    eyeDetectionPattern: 'long',
    color: 'bg-green-200',
    textColor: 'text-green-800',
    description: 'Tango: One sustained look'
  },
  { 
    letter: 'U', 
    morse: '..-', 
    eyeDetectionPattern: 'short-short-long',
    color: 'bg-red-200',
    textColor: 'text-red-800',
    description: 'Uniform: Two quick, one sustained glance'
  },
  { 
    letter: 'V', 
    morse: '...-', 
    eyeDetectionPattern: 'short-short-short-long',
    color: 'bg-purple-200',
    textColor: 'text-purple-800',
    description: 'Victor: Three quick, one sustained glance'
  },
  { 
    letter: 'W', 
    morse: '.--', 
    eyeDetectionPattern: 'short-long-long',
    color: 'bg-yellow-200',
    textColor: 'text-yellow-800',
    description: 'Whiskey: Quick, two sustained looks'
  },
  { 
    letter: 'X', 
    morse: '-..-', 
    eyeDetectionPattern: 'long-short-short-long',
    color: 'bg-pink-200',
    textColor: 'text-pink-800',
    description: 'X-ray: Sustained, two quick, sustained look'
  },
  { 
    letter: 'Y', 
    morse: '-.--', 
    eyeDetectionPattern: 'long-short-long-long',
    color: 'bg-indigo-200',
    textColor: 'text-indigo-800',
    description: 'Yankee: Sustained, quick, two sustained looks'
  },
  { 
    letter: 'Z', 
    morse: '--..', 
    eyeDetectionPattern: 'long-long-short-short',
    color: 'bg-cyan-200',
    textColor: 'text-cyan-800',
    description: 'Zulu: Two sustained, two quick glances'
  }
];


const MorseCodeEyeFlashcards = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [detectionMode, setDetectionMode] = useState(false);
    const [userDetectionAttempts, setUserDetectionAttempts] = useState([]);
    const [detectionStatus, setDetectionStatus] = useState(null);
    const videoRef = useRef(null);
  
    const toggleDetectionMode = () => {
      setDetectionMode(!detectionMode);
      
      if (!detectionMode) {
        startCamera();
      } else {
        stopCamera();
      }
    };
  
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
        alert("Please allow camera access for eye detection.");
      }
    };
  
    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  
    const simulateDetection = (type) => {
      const newAttempts = [...userDetectionAttempts, type];
      setUserDetectionAttempts(newAttempts);
  
      const currentCard = morseCodeData[currentCardIndex];
      const patternParts = currentCard.eyeDetectionPattern.split('-');
      
      if (newAttempts.length === patternParts.length) {
        const isCorrect = newAttempts.join('-') === currentCard.eyeDetectionPattern;
        
        if (isCorrect) {
          setDetectionStatus('success');
          setIsFlipped(true);
        } else {
          setDetectionStatus('failure');
        }
        
        // Reset attempts after checking
        setTimeout(() => {
          setUserDetectionAttempts([]);
          setDetectionStatus(null);
        }, 2000);
      }
    };
  
    const resetCard = () => {
      setUserDetectionAttempts([]);
      setDetectionStatus(null);
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
  
    useEffect(() => {
      return () => {
        stopCamera();
      };
    }, []);
  
    const currentCard = morseCodeData[currentCardIndex];
  
    return (
      <div className="morse-tutorial-container">
        <div className="morse-tutorial-card">
          {/* Camera Preview */}
          {detectionMode && (
            <div className="camera-preview">
              <video 
                ref={videoRef} 
                autoPlay 
                className="camera-video"
              />
            </div>
          )}
  
          {/* Flashcard Content */}
          <div className={`flashcard ${currentCard.color}`}>
            {/* Letter Display */}
            <div className={`letter-display ${currentCard.textColor}`}>
              {currentCard.letter}
            </div>

            <div className="card-content">
              
                <div className={`morse-code ${currentCard.textColor}`}>
                  {currentCard.morse}
                </div>
                {/* Morse Code Details */}
                {isFlipped && (
                  <div className={`description ${currentCard.textColor}`}>
                    {currentCard.description}
                </div>
                )}
            </div>

            {/* Detection Controls */}
            <div className="detection-controls">
              <button 
                onClick={toggleDetectionMode} 
                className={`detection-toggle ${
                  detectionMode 
                    ? 'detection-active' 
                    : 'detection-inactive'
                }`}
              >
                <Eye className="button-icon" />
                {detectionMode ? 'Stop Detection' : 'Start Eye Detection'}
              </button>
  
              {detectionMode && (
                <div className="look-buttons">
                  <button 
                    onClick={() => simulateDetection('short')}
                    className="look-button quick-look"
                  >
                    Quick Look
                  </button>
                  <button 
                    onClick={() => simulateDetection('long')}
                    className="look-button sustained-look"
                  >
                    Sustained Look
                  </button>
                </div>
              )}
            </div>
  
            {/* Detection Status */}
            {detectionStatus === 'success' && (
              <div className="status-message success">
                <CheckCircle className="status-icon" /> Correct Detection!
              </div>
            )}
            {detectionStatus === 'failure' && (
              <div className="status-message failure">
                <XCircle className="status-icon" /> Incorrect Detection
              </div>
            )}
  
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
  
export default MorseCodeEyeFlashcards