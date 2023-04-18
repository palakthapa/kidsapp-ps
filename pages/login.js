import { NextSeo } from 'next-seo';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppState } from '../store';
import { getUserData, logIn } from '../store/reducers/userProfileReducer';
import Error from '../components/Error';
import Loading from '../components/Loading';

export default function Signin() {

    const [loginState, setLoginState] = useState({
        email: "",
        password: ""
    });

    const router = useRouter();
    const [state, dispatch] = useAppState();

    useEffect(() => {

        if (state.appState.isError) return;
        if (state.userProfile) {
            if (state.userProfile.isNewUser) router.push("/signup/verify");
            else if (state.userProfile.isAdmin) router.push("/admin");
            else router.push("/");
            return;
        } else {
            getUserData().then(data => {
                if (data) {
                    dispatch({
                        "type": "setUserProfile",
                        "payload": data
                    })
                } else {
                    dispatch({
                        type: "setLoadingState",
                        payload: false
                    });
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }, [state.userProfile]);
    // state.appState.isError, state.appState.isLoading

    const handleChange = (e) => {
        setLoginState({ ...loginState, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        authenticateUser();
    }

    //Handle Login API Integration here
    const authenticateUser = async () => {
        try {

            dispatch({
                type: "setLoadingState",
                payload: true
            })
            console.log("here");
            dispatch({
                "type": "setUserProfile",
                "payload": await logIn(loginState)
            });
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        state.appState?.isError ? <Error /> : state.appState?.isLoading ? <Loading /> :
            <div className='absolute w-[80%] left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] sm:w-[60%] md:w-[40%] lg:w-[30%]'>
                <NextSeo
                    title={`Log In | Kids Learning App`}
                    description={"Log In"}
                />
                <div className="mb-6">
                    <div className="flex justify-center">
                        <img
                            alt=""
                            className="h-14 w-14"
                            src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315" />
                    </div>
                    <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                    <p className="text-center text-sm text-gray-600 mt-5">
                        Don&apos;t have an account yet?&nbsp;
                        <Link href={"/signup"} className="font-medium text-purple">
                            Sign up
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="">
                        {/* Email field */}
                        <div className="my-5">
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                onChange={handleChange}
                                value={loginState.email}
                                id="email"
                                name="email"
                                type="email"
                                required={true}
                                className="rounded-md  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                autoComplete='email'
                            />
                        </div>
                        {/* Password field */}
                        <div className="my-5">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                onChange={handleChange}
                                value={loginState.password}
                                id="password"
                                name="password"
                                type="password"
                                required={true}
                                className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                autoComplete='current-password'
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between ">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-purple focus:ring-purple border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div>
                            <Link href="#" className="text-sm text-purple"> Forgot your password? </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple hover:text-purple hover:bg-white hover:border-purple mt-4"
                    >
                        Login
                    </button>
                </form>
            </div>
    )
}