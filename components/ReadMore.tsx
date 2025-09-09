"use client";
import { useState } from 'react';

interface ReadMoreProps {
  text: string;
  wordLimit: number;
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, wordLimit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const words = text.split(' ');
  const isLongText = words.length > wordLimit;

  const truncatedText = isLongText ? words.slice(0, wordLimit).join(' ') + '...' : text;

  return (
    <div>
      <p className="whitespace-pre-line">{isExpanded ? text : truncatedText}</p>
      {isLongText && (
        <button
          onClick={toggleReadMore}
          className="text-blue-600 hover:underline mt-2"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
