import Image from 'next/image'
import Layout from '../components/Layout'
import { useAppState } from '../store'
import { useRouter } from 'next/router'

export default function Home() {
  const [state, dispatch] = useAppState()
  const router = useRouter();

  const navigateTo = function (path) {
    dispatch({
      type: "setLoadingState",
      payload: true
    });
    router.push(path || "/");
  }

  return (
    <Layout title="Home">
      <div className='flex flex-col items-center justify-between w-full h-full'>
        <div className='w-4/5 flex flex-col justify-around sm:w-3/4 md:w-1/2 sm:flex-row'>

          {/* Learn Words Section */}
          <div className='w-full h-[200px] m-auto mb-6 sm:w-[32.5%] sm:mb-0'>
            <div className="relative w-full h-full bg-peach rounded-2xl px-5 overflow-hidden items-center">
              <button className="absolute text-lg text-peach bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2 z-10" onClick={() => { navigateTo("/learning/modules") }}>Start</button>
              <Image src={'/images/learn-words-bg.jpg'} width={140} height={150} alt="Learn Words" className="m-auto" />
            </div>
          </div>

          {/* Poems and Stories Section */}
          <div className='w-full h-[200px] m-auto mb-6 sm:w-[32.5%] sm:mb-0'>
            <div className="relative w-full h-full bg-wheat rounded-2xl px-5 overflow-hidden items-center">
              <button className="absolute text-lg text-wheat bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2 z-10" onClick={() => { navigateTo("/pns/modules") }}>Start</button>
              <Image src={'/images/poems-and-stories-bg.webp'} width={250} height={200} alt="Poems and Stories" className="m-auto scale-125" />
            </div>
          </div>

        </div>
        <div className='w-4/5 flex flex-col justify-around sm:w-3/4 md:w-1/2 sm:flex-row'>

          {/* Quiz Section */}
          <div className='w-full h-[200px] m-auto mb-6 sm:w-[32.5%] sm:mb-0'>
            <div className="relative w-full h-full bg-yellow rounded-2xl px-5 overflow-hidden items-center">
              <button className="absolute text-lg text-yellow bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2 z-10" onClick={() => { navigateTo("/quiz/modules") }}>Start</button>
              <Image src={'/images/quiz-time.jpg'} width={200} height={200} alt="Quiz Time" className="m-auto -mt-4" />
            </div>
          </div>

          {/* Whiteboard Section */}
          <div className='w-full h-[200px] m-auto mb-6 sm:w-[32.5%] sm:mb-0'>
            <div className="relative w-full h-full bg-green rounded-2xl px-5 overflow-hidden items-center">
              <button className="absolute text-lg text-green bg-white py-2 px-8 rounded-full bottom-3 left-1/2 -translate-x-1/2 z-10" onClick={() => { navigateTo("/whiteboard") }}>Start</button>
              <Image src={'/images/white-board.png'} width={135} height={170} alt="Whiteboard" className="m-auto" />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
