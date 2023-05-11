import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

const CircleLetters = function ({ word, clickHandler }) {
  const [letters, setLetters] = useState([]);
  const [letterCoords, setLetterCoords] = useState([]);
  const [pointsCoords, setPointsCoords] = useState([]);

  useEffect(() => {

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledLetters = shuffleArray(word.split(''));
    setLetters(shuffledLetters);

    const radius = Math.max(80, word.length * 10);
    const angle = (2 * Math.PI) / word.length;

    const calculateCoords = (radius, angle) => {
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      return { x, y };
    };

    const coordsArr_letter = [];
    const coordsArr_point = [];
    for (let i = 0; i < word.length; i++) {
      const coords_letter = calculateCoords(radius + 30, i * angle);
      const coords_point = calculateCoords(radius, i * angle);
      coordsArr_letter.push(coords_letter);
      coordsArr_point.push(coords_point);
    }

    setLetterCoords(coordsArr_letter);
    setPointsCoords(coordsArr_point);
  }, [word]);

  return (
    <div className='absolute top-0 w-full h-full'>
      {letters.map((letter, i) => {
        let posCoords = letterCoords[i];
        let pointCoords = pointsCoords[i];
        return (
          <div
            key={i}
            className="absolute w-[40px] h-[40px] text-center text-xl font-semibold py-1 top-1/2 left-1/2 transform origin-center bg-gray-100 rounded-md uppercase select-none element"
            style={{ transform: `translate(${posCoords.x - 20}px, ${posCoords.y - 20}px)` }}
            onClick={(e) => { clickHandler({ x: (150 + pointCoords.x) / 3, y: (150 + pointCoords.y) / 3 }, e.target, letter) }}
          >
            {letter}
          </div>
        );
      })}
    </div>
  )
}

const DrawInputHandler = ({ correctWord, successHandler, failureHandler, resetInput }) => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [disabledPoints, setDisabledPoints] = useState([]);
  const [currWord, setCurrWord] = useState("");

  useEffect(() => {
    if (currWord.length === correctWord.length) {
      if (currentLine.length > 0) {
        currentLine[1].classList.remove("bg-gray-300");
        setCurrentLine([]);
      }
      if (currWord === correctWord) {
        if (successHandler) successHandler();
      } else {
        if (failureHandler) failureHandler();
      }
    }
  }, [currWord]);

  useEffect(() => {
    setLines([]);
    if(currentLine.length > 0) currentLine[1].classList.remove("bg-gray-300");
    setCurrentLine([]);
    setDisabledPoints([]);
    setCurrWord("");
  }, [resetInput]);

  const handleLetterClick = (dot, target, letter) => {
    if (currWord.length === correctWord.length) return;
    if (currentLine.length === 0) {
      setCurrentLine([dot, target]);
      target.classList.add("bg-gray-300");
      setCurrWord(letter);
    } else if ((currentLine[0].x === dot.x && currentLine[0].y === dot.y) || disabledPoints.includes("x" + dot.x + ", y" + dot.y)) {
      return;
    } else {
      setLines([...lines, { id: nanoid(), from: currentLine[0], to: dot }]);
      setDisabledPoints([...disabledPoints, "x" + currentLine[0].x + ", y" + currentLine[0].y]);
      currentLine[1].classList.remove("bg-gray-300");
      target.classList.add("bg-gray-300");
      setCurrentLine([dot, target]);
      setCurrWord(state => state + letter);
    }
  };

  return (
    <div className='relative h-full'>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <polygon points="1 1 6 5 1 9 1 1" stroke='black' strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke="black"
            strokeWidth="1"
            markerEnd="url(#arrow)"
            strokeLinecap="round"
          />
        ))}
        {/* {currentLine.length > 0 && (
          <line
            x1={currentLine[0].x}
            y1={currentLine[0].y}
            x2={currentLine[0].x}
            y2={currentLine[0].y}
            stroke="black"
            strokeWidth="1"
          // markerEnd="url(#arrow)"
          />
        )} */}
      </svg>
      <CircleLetters word={correctWord} clickHandler={handleLetterClick} />
    </div>
  );
};

export default DrawInputHandler;
