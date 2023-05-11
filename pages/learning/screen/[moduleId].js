import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout'
import DragAndDropInputHandler from '../../../components/LearningInputTypes/dragAndDropInputHandler';
import DrawInputHandler from '../../../components/LearningInputTypes/drawInputHandler';
import KeyboardInputHandler from '../../../components/LearningInputTypes/keyboardInputHandler';
import { useAppState } from '../../../store'
import SoundButton from '../../../components/Commons/soundButton';
import Icon from '../../../components/Commons/icon';
import { faChevronLeft, faChevronRight, faRefresh } from '@fortawesome/free-solid-svg-icons';
import AxiosHelper from '../../../utils/axiosUtil';

export default function LearningScreen() {

    const [state, dispatch] = useAppState();
    const [successMessage, setSuccessMessage] = useState(null);
    const [failureMessage, setFailureMessage] = useState(null);
    const [nextActive, setNextActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resetInput, setResetInput] = useState(false);

    const router = useRouter();
    const moduleId = router.query.moduleId;
    const inputType = router.query.input;

    useEffect(() => {
        if (!state.userProfile) return;
        AxiosHelper("/api/learning/" + moduleId + "?items=1", "GET").then(function (response) {
            dispatch({
                type: "setItemsData",
                payload: response.data
            });

            if (response.data && response.data.length > 0) {
                router.replace({
                    query: { ...router.query, item: response.data[0]?.item_id },
                });
            } else {
                setCurrentItem(null);
                setLoading(false);
            }

        }).catch(err => {
            dispatch({
                type: "setItemsData",
                payload: null
            });
        })
    }, []);

    useEffect(() => {
        if (!loading) {
            setSuccessMessage(null);
            setFailureMessage(null);
            setNextActive(false);
        }
    }, [resetInput])

    const itemId = router.query.item;
    const [currentItem, setCurrentItem] = useState(null);
    const [prevItemId, setPrevItemId] = useState(null);
    const [nextItemId, setNextItemId] = useState(null);

    useEffect(() => {
        if (!state.userProfile) return;
        if (itemId) {
            setCurrentItem(state.modulesData.items?.find((item, i) => {
                if (item.item_id === itemId) {
                    if (state.modulesData.items[i - 1]) setPrevItemId(state.modulesData.items[i - 1].item_id);
                    else setPrevItemId(null);
                    if (state.modulesData.items[i + 1]) setNextItemId(state.modulesData.items[i + 1].item_id);
                    else setNextItemId(null);
                    return true;
                } else return false;
            }) || null);
            setLoading(false);
        }
    }, [itemId]);

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

    const handleItemChange = function (id) {
        if (!id) return;
        setLoading(true);
        setSuccessMessage(null);
        setFailureMessage(null);
        setNextActive(false);
        router.replace({
            query: { ...router.query, item: id },
        });
    }

    const successInputHandler = function () {
        const audio = new Audio(currentItem?.sound_url || '/sounds/apple.mp3');
        audio.onended = () => {

            if (nextItemId) {
                setNextActive(true);
                setSuccessMessage("Yay! Success :)");
            } else {
                setSuccessMessage("Great Job! You have completed this module :)");
            }
        }
        audio.play();
    }

    const failureInputHandler = function () {
        setFailureMessage("Nope! Failure :( Please Retry!");
    }

    return (
        <Layout title="Learning Screen">
            <div className='w-full h-full flex px-10'>
                <div className='h-full flex items-center group'>
                    <button className='w-[50px] p-2 sm:group-hover:h-full bg-gray-100 group-hover:bg-gray-200 bg-opacity-50 group-hover:bg-opacity-80 rounded-md'
                        onClick={() => { handleItemChange(prevItemId) }}
                        disabled={!prevItemId}
                    >
                        <Icon icon={faChevronLeft} />
                    </button>
                </div>
                <div className='w-4/5 h-full m-auto'>
                    <h1 className='text-2xl font-bold text-center mb-5'>
                        {inputType === "kb" ?
                            "Type the Spelling for the Image you see below" :
                            inputType === "dnd" ?
                                "Drag and Drop letters to the correct position" :
                                inputType === "dr" ?
                                    "Click and Join the letters in correct order" :
                                    null
                        }
                    </h1>
                    {loading ? <div>Loading....</div> :
                        (currentItem ?
                            <div className='w-full h-[calc(100%-52px)]'>
                                <div className='relative w-full h-3/4 flex flex-col justify-around items-center'>
                                    <div className='absolute right-0 top-0 flex'>
                                        <div className='mr-3'>
                                            <button className='box-border w-[35px] h-[35px] bg-white flex items-center justify-around font-bold shadow-md hover:bg-gray-200 rounded' onClick={() => { setResetInput(state => !state) }}>
                                                <Icon icon={faRefresh} className="w-[20px]"/> 
                                            </button>
                                        </div>
                                        <div className='mr-3'>
                                            <SoundButton src={currentItem.sound_url} />
                                        </div>
                                        <button className='py-1 px-3 bg-white border border-purple text-purple rounded-md' onClick={handleShowHint}>Hint</button>
                                    </div>
                                    <div className='w-full flex flex-col sm:flex-row justify-around items-center'>
                                        <div className='w-max flex flex-col items-center'>
                                            <div className='w-max border border-gray-200 rounded-lg overflow-hidden shadow-md'>
                                                <img src={currentItem.image_url} alt={currentItem.name + " Image"} width={150} height={150} className="h-auto" />
                                            </div>
                                            <div className={'bg-gray-100 text-center px-10 py-2 rounded-md mt-5 text-center text-xl font-bold uppercase ' + (showHint ? 'visible' : 'invisible')}>{currentItem.name}</div>
                                        </div>
                                        {inputType === "kb" ?
                                            <KeyboardInputHandler correctWord={currentItem.name.trim().toLowerCase()} successHandler={successInputHandler} failureHandler={failureInputHandler} resetInput={resetInput} /> :
                                            inputType === "dnd" ?
                                                <DragAndDropInputHandler correctWord={currentItem.name.trim().toLowerCase()} successHandler={successInputHandler} failureHandler={failureInputHandler} resetInput={resetInput} /> :
                                                inputType === "dr" ?
                                                    <DrawInputHandler correctWord={currentItem.name.trim().toLowerCase()} successHandler={successInputHandler} failureHandler={failureInputHandler} resetInput={resetInput} /> :
                                                    null
                                        }
                                    </div>
                                </div>
                                <div className='w-full h-1/4 relative'>
                                    <span className='absolute left-1/2 -translate-x-1/2 translate-y-1/2 opacity-0 py-2 px-4 bg-green text-lg font-semibold text-white rounded-md transition duration-150 ease-in'
                                        style={successMessage ? {
                                            transform: 'translate(-50%, 0)',
                                            opacity: '1'
                                        } : {}}
                                    >{successMessage}</span>
                                    <span className='absolute left-1/2 -translate-x-1/2 translate-y-1/2 opacity-0 py-2 px-4 bg-danger text-lg font-semibold text-white rounded-md transition duration-150 ease-in'
                                        style={failureMessage ? {
                                            transform: 'translate(-50%, 0)',
                                            opacity: '1'
                                        } : {}}
                                    >{failureMessage}</span>
                                </div>
                            </div> : <div>No item available...</div>)
                    }

                </div>
                <div className='h-full flex items-center group'>
                    <button className='w-[50px] p-2 sm:group-hover:h-full bg-gray-100 group-hover:bg-gray-200 bg-opacity-50 group-hover:bg-opacity-80 rounded-md'
                        style={(nextActive ? {
                            color: "#fff",
                            backgroundColor: '#a4d955'
                        } : {})}
                        onClick={() => { handleItemChange(nextItemId) }}
                        disabled={!nextItemId}
                    >
                        <Icon icon={faChevronRight} />
                    </button>
                </div>
            </div>
        </Layout>
    )
}