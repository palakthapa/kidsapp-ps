import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout'
import { useAppState } from '../../../store'
import AxiosHelper from '../../../utils/axiosUtil';
import PickCorrect from '../../../components/Quiz/pickCorrect';
import MatchCorrect from '../../../components/Quiz/matchCorrect';

export default function QuizScreen() {

    const [state, dispatch] = useAppState();
    const [successMessage, setSuccessMessage] = useState(null);
    const [failureMessage, setFailureMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const moduleId = router.query.moduleId;

    useEffect(() => {
        if (!state.userProfile) return;
        setLoading(false);
        AxiosHelper("/api/quiz/" + moduleId, "GET").then(function (response) {
            dispatch({
                type: "setItemsData",
                payload: response.data
            });

            if (response.data && response.data.length > 0) {
                router.replace({
                    query: { ...router.query, item: response.data[0]?.item_id },
                });
            }

        }).catch(err => {
            dispatch({
                type: "setItemsData",
                payload: null
            });
        })
    }, []);

    const itemId = router.query.item;
    const [currentItem, setCurrentItem] = useState(null);
    const [nextItemId, setNextItemId] = useState(null)

    useEffect(() => {
        if (!state.userProfile) return;
        if (itemId) {
            setCurrentItem(state.modulesData.items?.find((item, i) => {
                if (item.item_id === itemId) {
                    if (state.modulesData.items[i + 1]) setNextItemId(state.modulesData.items[i + 1].item_id);
                    else setNextItemId(null);
                    return true;
                } else return false;
            }) || null);
            setLoading(false);
        }
    }, [itemId]);

    const handleItemChange = function (id) {
        if (!id) return;
        setLoading(true);
        setSuccessMessage(null);
        setFailureMessage(null);
        router.replace({
            query: { ...router.query, item: id },
        });
    }

    const successHandler = function () {
        if (nextItemId) {
            setSuccessMessage("Yay! Success :)");
            setTimeout(()=> {
                handleItemChange(nextItemId);
            }, 2000);
        } else {
            setSuccessMessage("Great Job! You have completed this module :)");
        }
    }

    const failureHandler = function () {
        setFailureMessage("Nope! Failure :(");
    }

    return (
        <Layout title="Learning Screen">
            <div className='w-full h-full flex px-10'>
                <div className='w-4/5 h-full m-auto'>
                    {loading ? <div>Loading....</div> :
                        (currentItem ?
                            <>
                                {moduleId === "pick-correct" && <PickCorrect itemData={currentItem} successHandler={successHandler} failureHandler={failureHandler} />}
                                {moduleId === "match-correct" && <MatchCorrect itemData={currentItem} successHandler={successHandler} failureHandler={failureHandler} />}
                                <div className='w-full h-1/5 relative'>
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
                            </>
                            : <div>No item available...</div>)
                    }
                </div>
            </div>
        </Layout>
    )
}