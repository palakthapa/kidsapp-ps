import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppState } from '../../store';
import { getUserData, signUp } from '../../store/reducers/userProfileReducer';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

export default function Signup() {

    const [signupState, setSignupState] = useState({
        name: "",
        email: "",
        password: ""
    });

    const router = useRouter();
    const [state, dispatch] = useAppState();

    useEffect(() => {

        if(state.appState.isError) return;
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
    }, [state.userProfile, state.appState.isError, state.appState.isLoading]);

    const handleChange = (e) => {
        setSignupState({ ...signupState, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser();
    }

    //Handle Signup API Integration here
    const registerUser = async () => {
        // console.log(signupState)
        try {
            dispatch({
                "type": "setUserProfile",
                "payload": await signUp(signupState)
            });
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        state.appState?.isError ? <Error /> : state.appState?.isLoading ? <Loading /> :
        <div className='absolute w-[80%] left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] sm:w-[60%] md:w-[40%] lg:w-[30%]'>
            <NextSeo
                title={`Sign Up | Kids Learning App`}
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
                    Create an account
                </h2>
                <p className="text-center text-sm text-gray-600 mt-5">
                    Already have an account?&nbsp;
                    <Link href={"/login"} className="font-medium text-purple">
                        Log in
                    </Link>
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="">
                    {/* Name field */}
                    <div className="my-5">
                        <label htmlFor="email" className="sr-only">
                            Name
                        </label>
                        <input
                            onChange={handleChange}
                            value={signupState.name}
                            id="name"
                            name="name"
                            type="text"
                            required={true}
                            className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                            placeholder="Name"
                            autoComplete="username"
                        />
                    </div>
                    {/* Email field */}
                    <div className="my-5">
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            onChange={handleChange}
                            value={signupState.email}
                            id="email"
                            name="email"
                            type="email"
                            required={true}
                            className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            autoComplete="email"
                        />
                    </div>
                    {/* Password field */}
                    <div className="my-5">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            onChange={handleChange}
                            value={signupState.password}
                            id="password"
                            name="password"
                            type="password"
                            required={true}
                            className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            autoComplete="password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple hover:text-purple hover:bg-white hover:border-purple mt-4"
                >
                    Signup
                </button>
            </form>
        </div>
    )
}