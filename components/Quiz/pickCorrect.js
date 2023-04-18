import { useState } from 'react';
import SoundButton from '../Commons/soundButton';

export default function PickCorrect({ itemData, successHandler, failureHandler }) {

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

    const [selectedOption, setSelectedOption] = useState(-1);
    const optClickHandler = function (i) {
        setSelectedOption(i);
        if (i === itemData.correctOption) {
            if (successHandler) successHandler();
        } else {
            if (failureHandler) failureHandler();
        }
    }

    return (
        <div className='w-full h-4/5'>
            <h1 className='text-2xl font-bold text-center mb-5'>
                {itemData.question}
            </h1>

            <div className='relative w-full h-[calc(100%-52px)] flex flex-col justify-around items-center'>
                {(!itemData.image_url) ? <div className={'absolute top-0 left-1/2 -translate-x-1/2 bg-gray-100 text-center px-10 py-2 rounded-md text-center text-xl font-bold uppercase ' + (showHint ? 'visible' : 'invisible')}>{itemData.options[itemData.correctOption]}</div> : null}
                <div className='absolute right-0 top-0 flex'>
                    <div className='mr-3'>
                        <SoundButton src={itemData.sound_url} />
                    </div>
                    <button className='py-1 px-3 bg-white border border-purple text-purple rounded-md' onClick={handleShowHint}>Hint</button>
                </div>
                <div className='w-full flex justify-around items-center'>
                    {itemData.image_url ?
                        <div className='w-max flex flex-col items-center'>
                            <div className='w-max border border-gray-200 rounded-lg overflow-hidden shadow-md'>
                                <img src={itemData.image_url} alt={itemData.name + " Image"} width={150} height={150} className="h-auto" />
                            </div>
                            <div className={'bg-gray-100 text-center px-10 py-2 rounded-md mt-5 text-center text-xl font-bold uppercase ' + (showHint ? 'visible' : 'invisible')}>{itemData.options[itemData.correctOption]}</div>
                        </div> : null}
                    <div className='w-1/2 h-max flex flex-wrap justify-around items-center'>
                        {itemData.options.map((item, i) => (
                            <button key={i} className='w-[45%] bg-gray-100 border-2 border-gray-300 text-center py-3 mb-4 rounded-md cursor-pointer hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed'
                                style={selectedOption === i ? { backgroundColor: "rgb(209, 213, 219)" } : {}}
                                disabled={selectedOption > -1}
                                onClick={() => { optClickHandler(i) }}
                            >{item}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}