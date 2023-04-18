import { useState, useEffect, useRef } from 'react'
import Layout from '../../../components/Layout'
import Modal from '../../../components/Commons/modal';
import { useRouter } from 'next/router';
import SoundButton from '../../../components/Commons/soundButton';
import Icon from '../../../components/Commons/icon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAppState } from '../../../store';
import AxiosHelper from '../../../utils/axiosUtil';

export default function ModuleItemsAdminScreen() {
    // const data = [{
    //     "_id": 5678,
    //     "name": "Apple",
    //     "image_url": "/images/apple.png",
    //     "sound_url": "/sounds/apple.mp3"
    // }]

    const [state, dispatch] = useAppState();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [itemsData, setItemsData] = useState([]);
    const imageRef = useRef(null);
    const soundRef = useRef(null);
    const [itemId, setItemId] = useState(null);
    const [itemName, setItemName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [soundUrl, setSoundUrl] = useState("");
    const [isEditModal, setIsEditModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!(state.userProfile && state.userProfile.isAdmin)) return;

        AxiosHelper("/api/admin/learning/" + router.query.moduleId, "GET").then(function (response) {
            setItemsData(response.data);
            // console.log(response.data);
        }).catch(err => {
            setItemsData([]);
        })
    }, [])
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
        setItemName("");
        setImageUrl("");
        setSoundUrl("");
        setIsEditModal(false);
        setShowModal(false);
        setIsSaving(false);
    }

    const editModalAcceptHandler = async () => {
        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("itemName", itemName);
            if (imageRef.current.files) formData.append("imageFile", imageRef.current.files[0]);
            if (soundRef.current.files) formData.append("soundFile", soundRef.current.files[0]);
            const { data } = await AxiosHelper("/api/admin/learning/" + router.query.moduleId + "/" + itemId, "PATCH", {}, formData);
            console.log(data);
            alert("Item updated successfully");
        } catch (error) {
            console.error(error);
            alert("Some Error occured; Item not updated");
        } finally {
            resetStates()
        }
    }
    const editModalRejectHandler = (data) => {
        console.log('edit modal rejected')
        resetStates()
    }

    const openEditModalHandler = (data) => {
        console.log('open edit modal')
        setItemId(data.item_id);
        setItemName(data.name);
        setImageUrl(data.image_url);
        setSoundUrl(data.sound_url);
        setIsEditModal(true);
        setShowModal(true);
    }

    const newModalAcceptHandler = async () => {
        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("itemName", itemName);
            formData.append("imageFile", imageRef.current.files[0]);
            formData.append("soundFile", soundRef.current.files[0]);
            const { data } = await AxiosHelper("/api/admin/learning/" + router.query.moduleId, "POST", {}, formData);
            console.log(data);
            alert("Item added successfully");
        } catch (error) {
            console.error(error);
            alert("Some Error occured; Item not added");
        } finally {
            resetStates()
        }
    }
    const newModalRejectHandler = (data) => {
        console.log('new modal rejected');
        resetStates()
    }

    const openNewModalHandler = () => {
        setIsEditModal(false);
        console.log('open new modal');
        setShowModal(true);
    }


    return (
        <Layout title="Admin Console">
            <div className='w-4/5 mx-auto'>
                <h1 className="text-2xl text-center mb-5 font-bold">Items</h1>
                <div className='w-full flex flex-wrap justify-around'>
                    {itemsData.map((item, i) => {
                        return (
                            <div key={i} className={"w-[18%] h-[150px] bg-white rounded-2xl mb-4 group"} style={{ backgroundImage: "url('" + item.image_url + "')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "auto 150px" }}>
                                <div className="relative w-full h-full text-aqua bg-white bg-opacity-0 rounded-2xl px-5 group-hover:bg-opacity-[0.7] overflow-hidden transition-all duration-150 ease-in">
                                    <h2 className="absolute top-2 -right-10 group-hover:right-0 opacity-0 group-hover:opacity-100 w-3/4 rounded-l-full py-1 text-lg bg-aqua text-white font-semibold text-center transition-all duration-150 ease-in" title={item.name}>{item.name}</h2>
                                    <button className="absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:bottom-2 group-hover:opacity-100 text-lg text-white bg-aqua py-2 px-7 rounded-full transition-all duration-150 ease-in" onClick={() => { openEditModalHandler(item) }}>Edit</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full mt-4'>
                    <button className='border-box relative flex justify-around items-center py-2 pl-3 pr-6 bg-aqua text-white rounded-md mx-auto group' onClick={() => { openNewModalHandler() }}>
                        <Icon icon={faPlus} className="w-[20px] mr-2 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 ease-in" />
                        <span className='relative'>Add New Item</span>
                    </button>
                </div>
            </div>
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
                onAccept={isEditModal ? editModalAcceptHandler : newModalAcceptHandler}
                onReject={isEditModal ? editModalRejectHandler : newModalRejectHandler}
            >
                <h1 className='text-center font-bold text-xl'>{isEditModal ? "Edit the Item details" : "Add New Item"}</h1>
                <div className='w-full flex flex-col mt-5'>
                    {itemId ? <div className='w-4/5 mb-2'>
                        <label className='font-semibold sm:mr-2'>Item Id :</label>
                        <input type='text' className='bg-gray-100 py-1 px-3 rounded-md border-2 border-gray-200' value={itemId} disabled />
                    </div> : null}
                    <div className='sm:w-4/5 mb-2'>
                        <label className='font-semibold sm:mr-2'>Item Name :</label>
                        <input type='text' className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400' value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
                    </div>
                    <div className='sm:w-4/5'>
                        <label className='font-semibold'>Sound :</label>
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
        </Layout>
    )
}
