import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import config from '../../config';
import { useAppState } from '../../store';
import { getUserData } from '../../store/reducers/userProfileReducer';

export default function SignupVerify() {

    const router = useRouter();
    const [state, dispatch] = useAppState();

    useEffect(() => {

        if (state.appState.isError) return;
        if (state.userProfile) {
            if (!state.userProfile.isNewUser) {
                if (state.userProfile.isAdmin) router.push("/admin");
                else router.push("/");
                return;
            } else {
                let intervalId = setInterval(async () => {
                    let data = await getUserData(true);
                    if(data) {
                        dispatch({
                            "type": "setUserProfile",
                            "payload": data
                        })
                    }
                }, 3000);

                dispatch({
                    type: "setLoadingState",
                    payload: false
                });
                return () => { clearInterval(intervalId) }
            }
        } else {
            getUserData().then(data => {
                if (data) {
                    dispatch({
                        "type": "setUserProfile",
                        "payload": data
                    })
                } else {
                    router.push("/login");
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }, [state.userProfile, state.appState.isError, state.appState.isLoading]);

    return (
        state.appState?.isError ? <Error /> : state.appState?.isLoading ? <Loading /> :
            <div className='absolute w-[80%] left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] sm:w-[60%] md:w-[40%] lg:w-[30%]'>
                <NextSeo
                    title={`Verify Account | Kids Learning App`}
                    description={"Sign Up"}
                />
                <div className="mb-6">
                    <div className="flex justify-center">
                        <img
                            alt=""
                            className="h-14 w-14"
                            src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315" />
                    </div>
                    <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                        Verify Your Account
                    </h2>
                </div>
                <p className='text-center'>Please Contact the Administrator <br /><b>{config.ADMIN_NAME}&lt;{config.ADMIN_MAIL}&gt;</b> <br />For the account verification</p>
                <p className='w-full text-gray-400 inline-flex items-center justify-center mt-4'>
                    <svg className="animate-spin h-5 w-5 -ml-1 mr-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking for verification ...
                </p>
            </div>
    )
}