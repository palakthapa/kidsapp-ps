import { useEffect, useState } from "react"

export default function KeyboardInputHandler({ correctWord, successHandler, failureHandler, resetInput }) {

    const [currentWord, setCurrentWord] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(()=> {
        setCurrentWord("");
        setIsDisabled(false);
    }, [resetInput]);

    const onChangeHandler = function (e) {
        let word = e.target.value;
        setCurrentWord(word);
        if (word.trim().toLowerCase() === correctWord) {
            if (successHandler) successHandler();
            setIsDisabled(true);
            return;
        };
        if (word.length === correctWord.length) {
            if (failureHandler) failureHandler();
            setIsDisabled(true);
        }
    }

    return (
        <div className="flex items-center justify-around w-4/5">
            <input type="text" className="w-full sm:w-auto px-5 py-2 bg-gray-100 border-2 border-gray-400 rounded-md text-center text-xl font-bold uppercase tracking-widest"
                onChange={onChangeHandler}
                value={currentWord}
                disabled={isDisabled}
            />
        </div>
    )
}