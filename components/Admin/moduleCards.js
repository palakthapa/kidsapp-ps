import Image from "next/image"
import { useRouter } from "next/router"

export default function ModuleCards() {

    const router = useRouter();

    return (
        <div className='w-full flex flex-wrap items-center justify-around'>

            <div className='w-[46%] h-[170px] mb-4'>
                <div className="relative w-full h-full text-white bg-aqua rounded-xl px-4 overflow-hidden">
                    <h2 className="text-center text-3xl font-semibold mt-3">Learning Modules</h2>
                    <button className="absolute text-xl text-aqua bg-white py-1 px-8 rounded-full left-1/2 bottom-4 -translate-x-1/2" onClick={()=>{router.push("/admin/learning")}}>Edit</button>
                </div>
            </div>

            <div className='w-[46%] h-[170px] mb-4'>
                <div className="relative w-full h-full text-white bg-yellow rounded-xl px-4 overflow-hidden">
                    <h2 className="text-center text-3xl font-semibold mt-3">Quiz Modules</h2>
                    <button className="absolute text-xl text-yellow bg-white py-1 px-8 rounded-full left-1/2 bottom-4 -translate-x-1/2" onClick={()=>{router.push("/admin/quiz")}}>Edit</button>
                </div>
            </div>

            <div className='w-[46%] h-[170px] mb-4'>
                <div className="relative w-full h-full text-white bg-green rounded-xl px-4 overflow-hidden">
                    <h2 className="text-center text-3xl font-semibold mt-3">Poems and Stories</h2>
                    <button className="absolute text-xl text-green bg-white py-1 px-8 rounded-full left-1/2 bottom-4 -translate-x-1/2" onClick={()=>{router.push("/admin/pns")}}>Edit</button>
                </div>
            </div>

        </div>
    )
}










