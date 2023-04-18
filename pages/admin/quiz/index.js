import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';


export default function QuizModulesAdminScreen() {
    const router = useRouter();

    const navigateToScreen = (moduleId)=> {
        router.push("/admin/quiz/" + moduleId);
    }

    return (
        <Layout title="Admin Console">
            <div className='w-4/5 mx-auto'>
                <h1 className="text-2xl text-center mb-2 font-bold">Modules</h1>
                <div className='w-full flex flex-wrap justify-around'>

                    <div className="relative w-[23%] h-[150px] text-aqua bg-aqua rounded-2xl px-5 overflow-hidden mb-3">
                        <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Pick the Correct</h2>
                        <button className="absolute left-1/2 -translate-x-1/2 text-lg text-aqua bg-white py-2 px-8 rounded-full bottom-2" onClick={() => { navigateToScreen("pick-correct") }}>Open</button>
                    </div>

                    <div className="relative w-[23%] h-[150px] text-green bg-green rounded-2xl px-5 overflow-hidden mb-3">
                        <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Match the Correct</h2>
                        <button className="absolute left-1/2 -translate-x-1/2 text-lg text-green bg-white py-2 px-8 rounded-full bottom-2" onClick={() => { navigateToScreen("match-correct") }}>Open</button>
                    </div>
                    
                </div>
            </div>
        </Layout>
    )
}
