import React, { useState } from 'react';
import './flashcards.css'; 

const projectCards = [
    {
<<<<<<< HEAD
        title: "Morse Code Translation",
        description: "An innovative web application that translates Morse code in real-time, bridging communication barriers and preserving historical communication methods.",
        impact: "Empowers users to decode and encode messages quickly and accurately"
    },
    {
        title: "User Authentication System",
        description: "Secure login and registration mechanism with robust backend protection and seamless frontend integration.",
        impact: "Ensures user data privacy and provides a smooth authentication experience"
    },
    {
        title: "Interactive Learning Platform",
        description: "Comprehensive tutorial section with visual guides and interactive Morse code learning tools.",
        impact: "Makes learning Morse code engaging and accessible for all skill levels"
    },
    {
        title: "Translation & History Tracking",
        description: "Advanced feature that logs user translation history and provides insights into usage patterns.",
        impact: "Allows users to review and learn from their previous interactions"
=======
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
>>>>>>> 328cb1bcc5554da90ddce82727137ec47ef1e209
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
<<<<<<< HEAD
                        <div className="flashcard-impact">
                            <div className="flashcard-impact-title">Project Impact:</div>
                            <div className="flashcard-impact-text">{card.impact}</div>
                        </div>
=======
                         {/*  <div className="flashcard-impact">
                            <div className="flashcard-impact-title">Project Impact:</div>
                            <div className="flashcard-impact-text">{card.impact}</div>
                        </div>*/}
>>>>>>> 328cb1bcc5554da90ddce82727137ec47ef1e209
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MorseCodeFlashcards;