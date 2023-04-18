import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { useRef } from 'react';

export default function MatchCorrect({ itemData, successHandler, failureHandler }) {

    const svgRef = useRef(null);
    const [matches, setMatches] = useState([]);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const [disabledPoints, setDisabledPoints] = useState([]);

    useEffect(()=> {
        if (matches.length === itemData.correctMatch.length) {
            if(matches.join('') === itemData.correctMatch.join('')) {
                if(successHandler) successHandler();
            } else {
                if(failureHandler) failureHandler();
            }
        }
    }, [matches])

    const [showHint, setShowHint] = useState(false);
    let hintShowTimeoutId = null;
    const handleShowHint = function () {
        if (hintShowTimeoutId) clearTimeout(hintShowTimeoutId);
        setShowHint(show => {
            if (!show) {
                hintShowTimeoutId = setTimeout(() => {
                    setShowHint(false);
                }, 3000);
            }
            return !show;
        });
    }

    const handleLetterClick = (dot, target, index, type) => {
        if (type) {
            if (currentLine.length === 0) {
                if (disabledPoints.includes(index)) return;
                setCurrentLine([dot, target, index]);
                target.classList.add("bg-gray-300");
            } else {
                currentLine[1].classList.remove("bg-gray-300");
                if (currentLine[2] === index) {
                    setCurrentLine([dot, target, index]);
                    target.classList.add("bg-gray-300");
                } else {
                    setCurrentLine([]);
                }
            }
        } else {
            if(matches.includes(index)) return;
            setLines([...lines, { id: nanoid(), from: currentLine[0], to: dot }]);
            setDisabledPoints([...disabledPoints, currentLine[2]]);
            setMatches([...matches, index]);
            currentLine[1].classList.remove("bg-gray-300");
            setCurrentLine([]);
        }
    };

    const leftOptClickHandler = function (e, i) {
        const svgCoords = svgRef.current?.getBoundingClientRect();
        let ps = e.target.getBoundingClientRect();
        let paddingLeft = (ps.width - ps.height)/2;
        let x = (e.target.offsetLeft + e.target.offsetWidth - paddingLeft) / (svgCoords.width / 100),
            y = (e.target.offsetTop + e.target.offsetHeight / 2) / (svgCoords.height / 100);
        handleLetterClick({ x, y }, e.target, i, 1);
    }
    const rightOptClickHandler = function (e, i) {
        const svgCoords = svgRef.current?.getBoundingClientRect();
        let ps = e.target.getBoundingClientRect();
        let paddingLeft = (ps.width - ps.height)/2;
        let x = (e.target.offsetLeft + paddingLeft) / (svgCoords.width / 100),
            y = (e.target.offsetTop + e.target.offsetHeight / 2) / (svgCoords.height / 100);
        handleLetterClick({ x, y }, e.target, i, 0);
        // handleLetterClick({ x: ps.right - 5, y: ps.top + (ps.bottom - ps.top) / 2 }, e.target, i, 0);
    }

    return (
        <div className='w-full h-4/5'>
            <h1 className='text-2xl font-bold text-center mb-5'>
                {itemData.question}
            </h1>
            <div className='relative w-full h-[calc(100%-52px)] flex flex-col justify-around items-center'>
                <div className={'absolute top-0 left-1/2 -translate-x-1/2 bg-gray-100 text-center px-10 py-2 rounded-md text-center text-xl font-bold uppercase ' + (showHint ? 'visible' : 'invisible')}>{`1 : ${itemData.correctMatch[0]+1}; 2 : ${itemData.correctMatch[1]+1}; 3 : ${itemData.correctMatch[2]+1}; 4 : ${itemData.correctMatch[3]+1};`}</div>
                <div className='absolute right-0 top-0 flex'>
                    <button className='py-1 px-3 bg-white border border-purple text-purple rounded-md' onClick={handleShowHint}>Hint</button>
                </div>

                <div className='relative w-3/4 h-full pt-12'>

                    <div className='relative w-full h-full flex justify-between items-center z-10'>
                        <div className='w-2/5 h-full flex flex-col justify-around items-center'>
                            {itemData.leftOptions.map((item, i) => (
                                <div key={i} className='w-[85%] bg-gray-100 border-2 border-gray-300 text-center py-3 mb-4 rounded-md cursor-pointer hover:bg-gray-400'
                                    onClick={(e) => { leftOptClickHandler(e, i) }}
                                >{item}</div>
                            ))}
                        </div>
                        <div className='w-2/5 h-full flex flex-col justify-around items-center'>
                            {itemData.rightOptions.map((item, i) => (
                                <div key={i} className='w-[85%] bg-gray-100 border-2 border-gray-300 text-center py-3 mb-4 rounded-md cursor-pointer hover:bg-gray-400'
                                    onClick={(e) => { rightOptClickHandler(e, i) }}
                                >{item}</div>
                            ))}
                        </div>
                    </div>

                    <svg className="absolute top-12 w-full h-full z-0" viewBox="0 0 100 100" ref={svgRef}>
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
                    </svg>


                </div>

            </div>
        </div>
    )
}
