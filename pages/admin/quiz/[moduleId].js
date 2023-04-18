import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../../components/Layout'
import PickCorrectItemModal from '../../../components/Quiz/admin/pickCorrect/modal';
import Icon from '../../../components/Commons/icon';
import { useAppState } from '../../../store';
import AxiosHelper from '../../../utils/axiosUtil';
import PickCorrectItem from '../../../components/Quiz/admin/pickCorrect/item';
import MatchCorrectItem from '../../../components/Quiz/admin/matchCorrect/item';
import MatchCorrectItemModal from '../../../components/Quiz/admin/matchCorrect/modal';

export default function ModuleItemsAdminScreen() {

    const router = useRouter();
    const [state, dispatch] = useAppState();
    const [itemData, setItemData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);

    const moduleId = router.query.moduleId;

    useEffect(() => {
        if (!(state.userProfile && state.userProfile.isAdmin)) return;

        AxiosHelper("/api/admin/quiz/" + moduleId, "GET").then(function (response) {
            dispatch({
                type: "setItemsData",
                payload: response.data
            });

        }).catch(err => {
            console.error(err);
            dispatch({
                type: "setItemsData",
                payload: null
            });
        })
    }, [])

    const editModalAcceptHandler = async (formData) => {
        try {
            const { data } = await AxiosHelper("/api/admin/quiz/" + moduleId + "/" + itemData.item_id, "PATCH", {}, formData);
            console.log(data);
            alert("Item updated successfully");
        } catch (error) {
            console.error(error);
            alert("Some Error occured; Item not updated");
        } finally {
            setItemData(null);
            setIsEditModal(false);
        }
    }

    const editModalRejectHandler = () => {
        console.log('edit modal rejected')
        setItemData(null);
        setIsEditModal(false);
    }

    const openEditModalHandler = (data) => {
        console.log('open edit modal');
        setIsEditModal(true);
        setItemData(data);
        setShowModal(true);
    }

    const newModalAcceptHandler = async (formData) => {
        try {
            const { data } = await AxiosHelper("/api/admin/quiz/" + moduleId, "POST", {}, formData);
            console.log(data);
            alert("Item added successfully");
        } catch (error) {
            console.error(error);
            alert("Some Error occured; Item not added");
        }
    }
    const newModalRejectHandler = () => {
        console.log('new modal rejected');
    }

    const openNewModalHandler = () => {
        console.log('open new modal');
        setIsEditModal(false);
        setShowModal(true);
    }


    return (
        <Layout title="Admin Console">
            <div className='w-4/5 mx-auto'>
                <h1 className="text-2xl text-center mb-5 font-bold">Items</h1>
                <div className='w-full flex flex-wrap justify-around'>
                    {state.modulesData.items ? (state.modulesData.items.length > 0 ? state.modulesData.items.map((item, i) => {
                        return (
                            moduleId === "pick-correct" ? <PickCorrectItem key={i} item={item} openEditModalHandler={openEditModalHandler} /> :
                            moduleId === "match-correct" ? <MatchCorrectItem key={i} item={item} openEditModalHandler={openEditModalHandler} /> :
                            null
                        )
                    }) : <div>No items available ...</div>) : <div>Loading ...</div>}
                </div>
                <div className='w-full mt-4'>
                    <button className='border-box relative flex justify-around items-center py-2 pl-3 pr-6 bg-aqua text-white rounded-md mx-auto group' onClick={() => { openNewModalHandler() }}>
                        <Icon icon={faPlus} className="w-[20px] mr-2 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 ease-in" />
                        <span className='relative'>Add New Item</span>
                    </button>
                </div>
            </div>
            {moduleId === 'pick-correct' &&
                <PickCorrectItemModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    isEditModal={isEditModal}
                    itemData={itemData}
                    acceptHandler={isEditModal ? editModalAcceptHandler : newModalAcceptHandler}
                    rejectHandler={isEditModal ? editModalRejectHandler : newModalRejectHandler}
                />
            }
            {moduleId === 'match-correct' &&
                <MatchCorrectItemModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    isEditModal={isEditModal}
                    itemData={itemData}
                    acceptHandler={isEditModal ? editModalAcceptHandler : newModalAcceptHandler}
                    rejectHandler={isEditModal ? editModalRejectHandler : newModalRejectHandler}
                />
            }
        </Layout>
    )
}
