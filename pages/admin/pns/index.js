import { useState, useEffect, useRef } from 'react'
import Layout from '../../../components/Layout'
import Modal from '../../../components/Commons/modal';
import { useRouter } from 'next/router';
import Icon from '../../../components/Commons/icon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AxiosHelper from '../../../utils/axiosUtil';
import { useAppState } from '../../../store';
import SoundButton from '../../../components/Commons/soundButton';

export default function LearningModulesAdminScreen() {

    const [state, dispatch] = useAppState();
    const router = useRouter();
    const imagesRef = useRef(null);
    const soundRef = useRef(null);
    const [modulesData, setModulesData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [moduleId, setModuleId] = useState(null);
    const [moduleName, setModuleName] = useState("");
    const [images, setImages] = useState([]);
    const [soundUrl, setSoundUrl] = useState(null);
    const [moduleContent, setModuleContent] = useState("");
    const [isEditModal, setIsEditModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!(state.userProfile && state.userProfile.isAdmin)) return;
        // AxiosHelper("/api/admin/pns", "GET").then(function (response) {
        //     setModulesData(response.data);
        // }).catch(err => {
        //     setModulesData([]);
        // })
    }, [])

    const imageChangeHandler = (e) => {
        const files = e.target.files;

        setImages([]);

        for (let file of files) {
            if (file.type.indexOf("image") !== 0) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result;
                setImages(state => {
                    return [...state, imageUrl];
                });
            };

            reader.readAsDataURL(file);
        }
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
        setModuleId(null);
        setModuleName("");
        setModuleContent("");
        setImages([]);
        setSoundUrl(null);
        setIsEditModal(false);
        setShowModal(false);
        setIsSaving(false);
    }

    const editModalAcceptHandler = async (data) => {
        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("moduleName", moduleName);
            formData.append("moduleContent", moduleContent);
            let files = imagesRef.current.files;
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    formData.append('imageFiles[]', files[i]);
                }
            }
            if (soundRef.current.files) formData.append('soundFile', soundRef.current.files[0]);
            const { data } = await AxiosHelper("/api/admin/pns/" + moduleId, "PATCH", {}, formData);
            console.log(data);
            alert("Module updated successfully");
        } catch (error) {
            console.error(error);
            alert("Some Error occured; Module not updated");
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
        setModuleId(data.module_id);
        setModuleName(data.name);
        setModuleContent(data.content);
        setImages(data.images);
        setSoundUrl(data.sound_url);
        setIsEditModal(true);
        setShowModal(true);
    }

    const newModalAcceptHandler = async () => {
        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("moduleName", moduleName);
            formData.append("moduleContent", moduleContent);
            formData.append('soundFile', soundRef.current.files[0]);
            let files = imagesRef.current.files;
            for (let i = 0; i < files.length; i++) {
                formData.append('imageFiles[]', files[i]);
            }

            const { data } = await AxiosHelper("/api/admin/pns", "POST", {}, formData);
            console.log(data);
            alert("Module added successfully");
        } catch (error) {
            console.error(error);
            alert("Some Error occured; Module not added");
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
                <h1 className="text-2xl text-center mb-2 font-bold">Modules</h1>
                <div className='w-full flex flex-wrap justify-around'>
                    {modulesData.map((item, i) => {
                        return (
                            <div key={i} className={"w-[18%] h-[150px] bg-white rounded-2xl mb-4 group"} style={{ backgroundImage: "url('" + item.images[0] + "')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "auto 150px" }}>
                                <div className="relative w-full h-full text-aqua bg-white bg-opacity-0 rounded-2xl px-5 group-hover:bg-opacity-[0.7] overflow-hidden transition-all duration-150 ease-in">
                                    <h2 className="absolute top-2 -right-10 group-hover:right-0 opacity-0 group-hover:opacity-100 w-3/4 rounded-l-full py-1 text-lg bg-aqua text-white font-semibold text-center transition-all duration-150 ease-in" title={item.name}>{item.name}</h2>
                                    <div className='absolute left-0 -bottom-10 opacity-0 group-hover:bottom-2 group-hover:opacity-100 w-full flex items-center justify-around transition-all duration-150 ease-in'>
                                        <button className="text-lg text-aqua border-2 border-aqua py-1 px-6 rounded-full" onClick={() => { openEditModalHandler(item) }}>Edit</button>
                                        <button className="text-lg text-white border-2 border-aqua  bg-aqua py-1 px-6 rounded-full" onClick={() => { router.push("/admin/learning/" + item.module_id) }}>Open</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full mt-4'>
                    <button className='border-box relative flex justify-around items-center py-2 pl-3 pr-6 bg-aqua text-white rounded-md mx-auto group' onClick={() => { openNewModalHandler() }}>
                        <Icon icon={faPlus} className="w-[20px] mr-2 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-150 ease-in" />
                        <span className='relative'>Add New Module</span>
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
                <h1 className='text-center font-bold text-xl'>{isEditModal ? "Edit the Module details" : "Add New Module"}</h1>
                <div className='w-full flex flex-col mt-5'>
                    {moduleId ? <div className='w-4/5 mb-2'>
                        <label className='font-semibold sm:mr-2'>Module Id :</label>
                        <input type='text' className='bg-gray-100 py-1 px-3 rounded-md border-2 border-gray-200' value={moduleId} disabled />
                    </div> : null}
                    <div className='sm:w-4/5 mb-2'>
                        <label className='font-semibold sm:mr-2'>Module Name :</label>
                        <input type='text' className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400' value={moduleName} onChange={(e) => { setModuleName(e.target.value) }} />
                    </div>
                    <div className='sm:w-4/5 mb-2 flex items-center'>
                        <label className='font-semibold sm:mr-2'>Module Story :</label>
                        <textarea className='bg-gray-200 py-1 px-3 rounded-md border-2 border-gray-400' value={moduleContent} onChange={(e) => { setModuleContent(e.target.value) }} />
                    </div>
                    <div className='sm:w-4/5'>
                        <label className='font-semibold'>Sound :</label>
                        <div className='flex flex-col items-center sm:mt-2'>
                            {soundUrl ? <SoundButton src={soundUrl} /> : null}
                            <input type='file' accept="audio/*" ref={soundRef} className='mt-2' onChange={soundChangeHandler} />
                        </div>
                    </div>
                    <div className='sm:w-4/5'>
                        <label className='font-semibold'>Module Images (select images sequence-wise) :</label>
                        <div className='flex flex-col items-center sm:mt-2'>
                            <div className='w-full flex flex-wrap justify-between'>
                                {images ? images.map((url, i) => <img key={i} src={url || "/images/apple.png"} width={150} height={150} alt="Module cover image" className='h-auto mx-auto' />)
                                    : null}
                            </div>
                            <input type='file' multiple={true} ref={imagesRef} accept="image/*" className='mt-2' onChange={imageChangeHandler} />
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    )
}
