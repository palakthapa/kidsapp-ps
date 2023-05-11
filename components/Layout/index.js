import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppState } from "../../store";
import UserDropdown from "./userDropdown";
import Error from "../Error";
import Loading from "../Loading";
import Icon from "../Commons/icon";
import { faChevronLeft, faHouse } from "@fortawesome/free-solid-svg-icons";

const Layout = function ({ children, title }) {

    const [state, dispatch] = useAppState();
    const router = useRouter();

    useEffect(() => {

        if (!state.appState.isLoading) {
            dispatch({
                type: "setLoadingState",
                payload: true
            });
        }

        if (state.appState.isError) return;
        if (!state.userProfile) {
            router.push("/login");
            return;
        } else if (state.userProfile && state.userProfile.isAdmin && router.route.indexOf("/admin") !== 0) {
            router.push("/admin");
        } else if (state.userProfile && state.userProfile.isNewUser) {
            router.push("/signup/verify");
            return;
        }

        dispatch({
            type: "setLoadingState",
            payload: false
        });
    }, [state.userProfile, router.route]);
    // state.appState.isError, state.appState.isLoading

    return (
        state.appState?.isError ? <Error /> : state.appState?.isLoading ? <Loading /> :
            <>
                <NextSeo
                    title={`${title} | Kidsapp PS`}
                    description={title}
                />
                <div className="w-screen h-screen bg-main-bg-img">
                    <div className="w-full h-full bg-white bg-opacity-[0.85]">
                        {state.userProfile && state.userProfile.isAdmin ? <div className="hidden sm:block absolute left-1/2 top-8 -translate-x-1/2 text-2xl font-bold">Admin User</div> : null}
                        <div className="relative px-10 py-3 tall:py-6 flex items-center justify-between">
                            {router.route === "/" || router.route === "/admin" ?
                                <Image src={'/images/logo.png'} alt={"logo"} width={40} height={50} /> :
                                <div className="flex">
                                    <button className="w-[30px] h-[30px] p-1 bg-gray-200 hover:bg-gray-300 rounded-sm mr-3" onClick={() => { router.back() }}>
                                        <Icon icon={faChevronLeft} className="w-full h-full" />
                                    </button>
                                    <button className="w-[30px] h-[30px] p-1 bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => { router.push(state.userProfile.isAdmin ? "/admin" : "/") }}>
                                        <Icon icon={faHouse} className="" />
                                    </button>
                                </div>
                            }
                            <div className="flex items-center">
                                <h2 className="hidden sm:block text-lg font-bold mr-3">Hi, {state.userProfile?.name}</h2>
                                <UserDropdown />
                            </div>
                        </div>
                        <div className="w-full h-[calc(100vh-117px)] tall:h-[calc(100vh-141px)]">
                            {children}
                        </div>
                        {/* <footer className="fixed bottom-0 w-full py-2 bg-gray-200 bg-opacity-50 text-center">
                            <div className="text-center text-md text-gray-500">Made with <span className="text-danger">&#10084;</span> by <b>Palak</b> and <b>Sejal</b></div>
                        </footer> */}
                    </div>
                </div>
            </>
    )
}

export default Layout;