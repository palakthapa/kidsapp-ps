import { useState, useRef } from 'react'
import Modal from '../../../Commons/modal';
import SoundButton from '../../../Commons/soundButton';
import { useEffect } from 'react';

export default function PickCorrectItemModal({ showModal, setShowModal, isEditModal, itemData, acceptHandler, rejectHandler }) {

    const imageRef = useRef(null);
    const soundRef = useRef(null);
    const [itemId, setItemId] = useState(null);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctOption, setCorrectOption] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [soundUrl, setSoundUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (showModal && isEditModal) {
            setItemId(itemData.item_id);
            setQuestion(itemData.question);
            setOptions(itemData.options);
            setCorrectOption(itemData.correctOption);
            setImageUrl(itemData.image_url);
            setSoundUrl(itemData.sound_url);
        }
    }, [showModal]);

    // read data as blob instead of reading as url
    const imageChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file.type.indexOf("image") !== 0) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            setImageUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    }

    const soundChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file.type.indexOf("audio") !== 0) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            setSoundUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    }

    const resetStates = () => {
        setItemId(null);
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectOption(0);
        setImageUrl("");
        setSoundUrl("");
        setShowModal(false);
        setIsSaving(false);
    }

    const handleModalAccept = async () => {
        setIsSaving(true);

        const formData = new FormData();
        formData.append("question", question);
        formData.append("options", JSON.stringify(options));
        formData.append("correctOption", correctOption.toString());
        if (imageRef.current.files) formData.append("imageFile", imageRef.current.files[0]);
        if (soundRef.current.files) formData.append("soundFile", soundRef.current.files[0]);

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
                    <label className='font-semibold sm:mr-2'>Enter Options and select correct one :</label>
                    <div className='w-full flex flex-wrap mt-2'>
                        {options.map((opt, i) => {
                            return (
                                <div key={i} className='w-[48%] mb-2'>
                                    <input type='radio' name='option' className='mr-1 cursor-pointer' checked={correctOption === i} onChange={(e) => { setCorrectOption(i) }} />
                                    <input type='text' className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400 w-4/5' value={opt} onChange={(e) => {
                                        setOptions(state => {
                                            state[i] = e.target.value;
                                            return [...state];
                                        })
                                    }} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='sm:w-4/5'>
                    <label className='font-semibold'>Sound : </label>
                    <div className='flex flex-col items-center sm:mt-2'>
                        {soundUrl ? <SoundButton src={soundUrl} /> : null}
                        <input type='file' accept="audio/*" ref={soundRef} className='mt-2' onChange={soundChangeHandler} />
                    </div>
                </div>
                <div className='sm:w-4/5'>
                    <label className='font-semibold'>Item Image :</label>
                    <div className='flex flex-col items-center sm:mt-2'>
                        {imageUrl ? <img src={imageUrl} width={150} height={150} alt="Item cover image" className='h-auto mx-auto' /> : null}
                        <input type='file' accept="image/*" ref={imageRef} className='mt-2' onChange={imageChangeHandler} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}