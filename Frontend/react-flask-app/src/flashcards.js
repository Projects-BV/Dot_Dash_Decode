import React, { useState } from 'react';
import './flashcards.css'; 

const projectCards = [
    {
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
                        <div className="flashcard-impact">
                            <div className="flashcard-impact-title">Project Impact:</div>
                            <div className="flashcard-impact-text">{card.impact}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MorseCodeFlashcards;