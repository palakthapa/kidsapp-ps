import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import Layout from '../../components/Layout'
import { useAppState } from '../../store'
import AxiosHelper from "../../utils/axiosUtil";
import Icon from "../../components/Commons/icon";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function LearnWordModules() {
    const [state, dispatch] = useAppState();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState(null);

    useEffect(() => {
        if (!state.userProfile) return;
        dispatch({
            type: "setModulesData",
            payload: null
        });
        if (!state.modulesData.modules) {
            AxiosHelper("/api/learning", "GET").then(function (response) {
                dispatch({
                    type: "setModulesData",
                    payload: response.data
                });
            }).catch(err => {
                dispatch({
                    type: "setModulesData",
                    payload: null
                });
            });
        }
    }, []);

    const modalCancelHandler = (e) => {
        setSelectedModuleId(null);
        setShowModal(false);
    }

    const moduleStartHandler = (moduleId) => {
        setSelectedModuleId(moduleId);
        setShowModal(true);
    }

    const navigateToLearningScreen = (inp) => {
        dispatch({
            type: "setLoadingState",
            payload: true
        });
        setSelectedModuleId(null);
        setShowModal(false);
        router.push("/learning/screen/" + selectedModuleId + "?input=" + inp);
    }

    return (
        <Layout title="Learning Modules">
            <div className='w-4/5 m-auto'>
                <h1 className='text-2xl font-bold text-center mb-5'>Choose from the Modules Below</h1>
                <div className='w-full flex flex-wrap justify-around'>
                    {state.modulesData?.modules && state.modulesData.modules.map((item, i) => {
                        return (
                            <div key={i} className="w-4/5 sm:w-1/3 lg:w-[18%] h-[150px] bg-white rounded-2xl mb-4 group" style={{ backgroundImage: "url('" + item.image_url + "')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "auto 150px" }}>
                                <div className="relative w-full h-full text-aqua bg-white bg-opacity-0 rounded-2xl px-5 group-hover:bg-opacity-[0.7] overflow-hidden transition-all duration-150 ease-in">
                                    <h2 className="absolute top-2 -right-10 group-hover:right-0 opacity-0 group-hover:opacity-100 w-3/4 rounded-l-full py-1 text-lg bg-aqua text-white font-semibold text-center transition-all duration-150 ease-in" title={item.name}>{item.name}</h2>
                                    <div className='absolute left-0 -bottom-10 opacity-0 group-hover:bottom-2 group-hover:opacity-100 w-full flex items-center justify-around transition-all duration-150 ease-in'>
                                        <button className="text-lg text-white border-2 border-aqua bg-aqua py-1 px-6 rounded-full" onClick={() => { moduleStartHandler(item.module_id) }}>Start</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {showModal ?
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
                            <div>
                                <h1 className="text-2xl font-bold pl-4 pr-16 py-2 sm:pl-6">Please select input type</h1>
                                <button
                                    className="absolute w-auto top-2 right-4 rounded-md px-4 py-2 bg-gray-100 text-gray-700 hover:bg-danger hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:text-sm"
                                    onClick={modalCancelHandler}
                                >
                                    <Icon icon={faTimes} className="w-[20px]" />
                                </button>
                            </div>

                            <div className="w-full flex flex-wrap justify-around items-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className='w-3/4 sm:w-[32%] h-[150px] mb-4'>
                                    <div className="relative w-full h-full text-white bg-aqua rounded-2xl px-5 overflow-hidden">
                                        <h2 className="text-center text-3xl font-semibold mt-2">Key-Board</h2>
                                        <button className="absolute text-lg text-aqua bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2" onClick={() => { navigateToLearningScreen("kb") }}>Start</button>
                                        {/* <Image src={'/images/key-board.png'} width={150} height={100} alt="Reading" className="absolute -top-1 right-0" /> */}
                                    </div>
                                </div>

                                <div className='w-3/4 sm:w-[32%] h-[150px] mb-4'>
                                    <div className="relative w-full h-full text-white bg-pink rounded-2xl px-5 overflow-hidden">
                                        <h2 className="text-center text-3xl font-semibold mt-2">Drag &amp; Drop</h2>
                                        <button className="absolute text-lg text-pink bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2" onClick={() => { navigateToLearningScreen("dnd") }}>Start</button>
                                        {/* <Image src={'/images/drag-and-drop.png'} width={120} height={100} alt="Reading" className="absolute -bottom-5 right-5" /> */}
                                    </div>
                                </div>

                                <div className='w-3/4 sm:w-[32%] h-[150px]'>
                                    <div className="relative w-full h-full text-white bg-purple rounded-2xl px-5 overflow-hidden">
                                        <h2 className="text-center text-3xl font-semibold mt-2">Draw</h2>
                                        <button className="absolute text-lg text-purple bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2" onClick={() => { navigateToLearningScreen("dr") }}>Start</button>
                                        {/* <Image src={'/images/draw.png'} width={180} height={100} alt="Reading" className="absolute -top-1 right-0" /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null
            }
        </Layout>
    )
}
