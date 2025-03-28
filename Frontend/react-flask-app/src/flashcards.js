import React, { useState } from 'react';
import './flashcards.css'; 

const projectCards = [
    {
        title: "Morse Code ",
        description: "Morse code is a communication method that uses short and long signals, called dots and dashes, to represent letters and numbers for transmitting messages. It is especially useful for individuals with disabilities, particularly those with speech impairments. ",
    },
    {
        title: "Morse Code Detection",
        description: "Morse code detection can be achieved using eye blinks by measuring their duration to distinguish between short and long blinks. Our website utilizes this method as an input mechanism for Morse code communication. ",

    },
    {
        title: "Morse Code Translation",
        description: "Morse code translation on our website is achieved using the eye blink method, where short and long blinks are used to input Morse code. The system then converts the Morse code into English text, making it readable for individuals with speech impairments. ",
    },
    {
        title: "Interactive Learning Platform",
        description: "Comprehensive tutorial section with visual guides and interactive Morse code learning tools. Makes learning morse code engaging and accessible and all skill levels. ",
    }
];

const MorseCodeFlashcards = () => {
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const getCardClass = (index) => {
        const diff = Math.abs(index - activeCardIndex);
        
        if (diff === 0) return 'card-active';
        if (diff === 1) return 'card-adjacent';
        return 'card-distant';
    };

    const getCardStyle = (index) => {
        const offsetX = (index - activeCardIndex) * 320;
        return {
            transform: `translateX(${offsetX}px) translateY(-50%)`,
            position: 'absolute',
            top: '50%',
            transition: 'all 0.3s ease-in-out'
        };
    };

    return (
        <div className="flashcards-container">
            <div className="flashcard-wrapper">
                {projectCards.map((card, index) => (
                    <div 
                        key={index}
                        className={`flashcard ${getCardClass(index)}`}
                        style={getCardStyle(index)}
                        onMouseEnter={() => setActiveCardIndex(index)}
                    >
                        <h3 className="flashcard-title">{card.title}</h3>
                        <p className="flashcard-description">{card.description}</p>
                         {/*  <div className="flashcard-impact">
                            <div className="flashcard-impact-title">Project Impact:</div>
                            <div className="flashcard-impact-text">{card.impact}</div>
                        </div>*/}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MorseCodeFlashcards;