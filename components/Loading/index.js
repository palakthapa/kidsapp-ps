export default function Loading() {
    return (
        <div className="absolute flex flex-col items-center w-[80%] left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] sm:w-[60%] md:w-[40%] lg:w-[30%]">
            <h2 className="text-3xl font-bold text-gray-700">Hold Back!</h2>
            <div className="mt-3">
                <div className="inline-block w-[15px] h-[15px] rounded-full bg-gray-400 mr-[1px] animate-[bounce_0.8s_0.12s_ease-out_infinite]"></div>
                <div className="inline-block w-[15px] h-[15px] rounded-full bg-gray-400 mr-[1px] animate-[bounce_0.8s_0.24s_ease-out_infinite]"></div>
                <div className="inline-block w-[15px] h-[15px] rounded-full bg-gray-400 animate-[bounce_0.8s_0.36s_ease-out_infinite]"></div>
            </div>
        </div>
    )
}