import Image from "next/image";

export default function Error() {
    return (
        <div className="w-screen h-screen bg-[#AECBE9] flex flex-col items-center justify-center">
            <Image src="/error-page-illustration.jpg" width={500} height={500} />
            <div className="w-4/5 flex justify-around md:w-3/5 lg:w-1/2">
                <button className="px-6 py-1 text-purple border-2 rounded-full border-purple">Contact Us</button>
                <button className="px-6 py-1 text-white bg-purple border-2 border-purple rounded-full hover:bg-transparent hover:text-purple">Refresh</button>
            </div>
        </div>
    )
}