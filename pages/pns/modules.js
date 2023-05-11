import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import Layout from '../../components/Layout'
import { useAppState } from '../../store'
import AxiosHelper from "../../utils/axiosUtil";

export default function PnSModules() {
    const [state, dispatch] = useAppState();
    const router = useRouter();

    useEffect(() => {
        if (!state.userProfile) return;
        dispatch({
            type: "setModulesData",
            payload: null
        });
        if (!state.modulesData.modules) {
            AxiosHelper("/api/pns", "GET").then(function (response) {
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

    const navigateToPnSScreen = (moduleId) => {
        dispatch({
            type: "setLoadingState",
            payload: true
        });
        router.push("/pns/screen/" + moduleId);
    }

    return (
        <Layout title="Learning Modules">
            <div className='w-4/5 m-auto'>
                <h1 className='text-2xl font-bold text-center mb-5'>Choose from the Modules Below</h1>
                <div className='w-full flex flex-wrap justify-around'>
                    {state.modulesData?.modules && state.modulesData.modules.map((item, i) => {
                        return (
                            <div key={i} className="w-4/5 sm:w-1/3 lg:w-[18%] h-[150px] bg-white rounded-2xl mb-4 group" style={{ backgroundImage: "url('" + item.images?.[0] + "')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "auto 150px" }}>
                                <div className="relative w-full h-full text-aqua bg-white bg-opacity-0 rounded-2xl px-5 group-hover:bg-opacity-[0.7] overflow-hidden transition-all duration-150 ease-in">
                                    <h2 className="absolute top-2 -right-10 group-hover:right-0 opacity-0 group-hover:opacity-100 w-3/4 rounded-l-full py-1 text-lg bg-aqua text-white font-semibold text-center transition-all duration-150 ease-in" title={item.name}>{item.name}</h2>
                                    <div className='absolute left-0 -bottom-10 opacity-0 group-hover:bottom-2 group-hover:opacity-100 w-full flex items-center justify-around transition-all duration-150 ease-in'>
                                        <button className="text-lg text-white border-2 border-aqua bg-aqua py-1 px-6 rounded-full" onClick={() => { navigateToPnSScreen(item.module_id) }}>Start</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}
