import { useState, useRef } from 'react'
import Modal from '../../../Commons/modal';
import { useEffect } from 'react';

export default function MatchCorrectItemModal({ showModal, setShowModal, isEditModal, itemData, acceptHandler, rejectHandler }) {

    const [itemId, setItemId] = useState(null);
    const [question, setQuestion] = useState("");
    const [leftOptions, setLeftOptions] = useState(["", "", "", ""]);
    const [rightOptions, setRightOptions] = useState(["", "", "", ""]);
    const [correctMatch, setCorrectMatch] = useState([0, 1, 2, 3]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (showModal && isEditModal) {
            setItemId(itemData.item_id);
            setQuestion(itemData.question);
            setLeftOptions(itemData.leftOptions);
            setRightOptions(itemData.rightOptions);
            setCorrectMatch(itemData.correctMatch);
        }
    }, [showModal]);

    const resetStates = () => {
        setItemId(null);
        setQuestion("");
        setLeftOptions(["", "", "", ""]);
        setRightOptions(["", "", "", ""]);
        setCorrectMatch([0, 1, 2, 3]);
        setShowModal(false);
        setIsSaving(false);
    }

    const handleModalAccept = async () => {
        setIsSaving(true);

        const formData = new FormData();
        formData.append("question", question);
        formData.append("leftOptions", JSON.stringify(leftOptions));
        formData.append("rightOptions", JSON.stringify(rightOptions));
        formData.append("correctMatch", JSON.stringify(correctMatch));

        if (acceptHandler) await acceptHandler(formData);

        resetStates()
    }

    const handleModalReject = async () => {
        if (rejectHandler) await rejectHandler();
        resetStates();
    }


    return (
        <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            acceptText={isSaving ?
                <p className='w-full text-white inline-flex items-center justify-center'>
                    <svg className="animate-spin h-5 w-5 -ml-1 mr-3 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving
                </p> : 'Save'}
            actionsDisabled={isSaving ? true : false}
            onAccept={handleModalAccept}
            onReject={handleModalReject}
        >
            <h1 className='text-center font-bold text-xl'>{isEditModal ? "Edit the Item details" : "Add New Item"}</h1>
            <div className='w-full flex flex-col mt-5'>
                {isEditModal ? <div className='w-4/5 mb-2'>
                    <label className='font-semibold sm:mr-2'>Item Id :</label>
                    <input type='text' className='bg-gray-100 py-1 px-3 rounded-md border-2 border-gray-200' value={itemId} disabled />
                </div> : null}
                <div className='sm:w-4/5 mb-2'>
                    <label className='font-semibold sm:mr-2'>Question :</label>
                    <input type='text' className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400' value={question} onChange={(e) => { setQuestion(e.target.value) }} />
                </div>
                <div className='sm:w-4/5 mb-2'>
                    <label className='font-semibold sm:mr-2'>Enter Options for Left Side :</label>
                    <div className='w-full flex flex-wrap mt-2'>
                        {leftOptions.map((opt, i) => {
                            return (
                                <div key={i} className='w-[48%] mb-2'>
                                    <input type='text' className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400 w-4/5' value={opt} onChange={(e) => {
                                        setLeftOptions(state => {
                                            state[i] = e.target.value;
                                            return [...state];
                                        })
                                    }} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='sm:w-4/5 mb-2'>
                    <label className='font-semibold sm:mr-2'>Enter Options for Right Side :</label>
                    <div className='w-full flex flex-wrap mt-2'>
                        {rightOptions.map((opt, i) => {
                            return (
                                <div key={i} className='w-[48%] mb-2'>
                                    <input type='text' className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400 w-4/5' value={opt} onChange={(e) => {
                                        setRightOptions(state => {
                                            state[i] = e.target.value;
                                            return [...state];
                                        })
                                    }} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='sm:w-4/5 mb-2'>
                    <label className='font-semibold sm:mr-2'>Select Correct Matches :</label>
                    <div className='w-full flex flex-wrap mt-2'>
                        {correctMatch.map((opt, i) => {
                            return (
                                <div key={i} className='w-[48%] mb-2'>
                                    {i + 1}. <input type='number' min={1} max={4} className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400 w-4/5' value={opt + 1} onChange={(e) => {
                                        setCorrectMatch(state => {
                                            let num = e.target.value;
                                            if (!Number.isNaN(num)) {
                                                if(num <= 4 && num >= 1) state[i] = num - 1;
                                                else if (num%10) state[i] = (num%10) - 1;
                                                return [...state];
                                            }
                                            return state;
                                        })
                                    }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    )
}