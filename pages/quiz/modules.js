import { useRouter } from "next/router"
import Layout from '../../components/Layout'
import { useAppState } from '../../store'

export default function Quiz() {

  const [state, dispatch] = useAppState();
  const router = useRouter();

  const navigateToScreen = (moduleId) => {
    router.push("/quiz/screen/" + moduleId);
  }

  return (
    <Layout title="Quiz Modules">
      <div className='w-4/5 m-auto'>
            <h1 className='text-2xl font-bold text-center mb-5'>Choose your favourite Module</h1>
            <div className='w-1/2 flex flex-wrap justify-around mx-auto'>

                <div className="relative w-[48%] h-[150px] text-aqua bg-aqua rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Pick the Correct</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-aqua bg-white py-2 px-8 rounded-full bottom-2" onClick={() => { navigateToScreen("pick-correct") }}>Start</button>
                </div>

                <div className="relative w-[48%] h-[150px] text-green bg-green rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Match the Correct</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-green bg-white py-2 px-8 rounded-full bottom-2" onClick={() => { navigateToScreen("match-correct") }}>Start</button>
                </div>

                {/*
                <div className="relative w-[23%] h-[150px] text-purple bg-purple rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Spell the Word</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-purple bg-white py-2 px-8 rounded-full bottom-2">Start</button>
                </div>
                <div className="relative w-[23%] h-[150px] text-green bg-green rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Math Skills</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-green bg-white py-2 px-8 rounded-full bottom-2">Start</button>
                </div>
                <div className="relative w-[23%] h-[150px] text-aqua bg-aqua rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Solve Puzzles</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-aqua bg-white py-2 px-8 rounded-full bottom-2">Start</button>
                </div>
                <div className="relative w-[23%] h-[150px] text-pink bg-pink rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Fill the Blanks</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-pink bg-white py-2 px-8 rounded-full bottom-2">Start</button>
                </div>
                
                <div className="relative w-[23%] h-[150px] text-purple bg-purple rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Connect the Dots</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-purple bg-white py-2 px-8 rounded-full bottom-2">Start</button>
                </div>
                <div className="relative w-[23%] h-[150px] text-pink bg-pink rounded-2xl px-5 overflow-hidden mb-3">
                    <h2 className="w-4/5 py-1 text-xl text-white font-semibold text-center m-auto mt-4">Make a Word</h2>
                    <button className="absolute left-1/2 -translate-x-1/2 text-lg text-pink bg-white py-2 px-8 rounded-full bottom-2">Start</button>
                </div> */}

            </div>
        </div>
    </Layout>
  )
}