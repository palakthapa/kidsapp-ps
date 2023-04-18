import { useState } from "react"

export default function KeyboardInputHandler({ correctWord, successHandler, failureHandler }) {

    const [currentWord, setCurrentWord] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

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
        <div>
            <input type="text" className="px-5 py-2 bg-gray-100 border-2 border-gray-400 rounded-md text-center text-xl font-bold uppercase tracking-widest"
                onChange={onChangeHandler}
                value={currentWord}
                disabled={isDisabled}
            />
        </div>
    )
}