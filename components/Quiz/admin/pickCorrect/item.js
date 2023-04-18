export default function PickCorrectItem({item, openEditModalHandler}) {
    return (
        <div className="relative w-[18%] h-[150px] bg-white rounded-2xl mb-4 group">
            <p className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-gray-600'>{item.question}</p>
            <div className="relative w-full h-full text-aqua bg-white bg-opacity-0 rounded-2xl px-5 group-hover:bg-opacity-[0.7] overflow-hidden transition-all duration-150 ease-in">
                <p className="absolute -top-6 left-0 group-hover:top-4 opacity-0 group-hover:opacity-100 w-full py-1 text-sm bg-aqua text-white font-semibold text-center transition-all duration-150 ease-in" title={item.item_id}>
                    {item.item_id}
                </p>
                <button className="absolute left-1/2 -translate-x-1/2 -bottom-10 opacity-0 group-hover:bottom-2 group-hover:opacity-100 text-lg text-white bg-aqua py-2 px-7 rounded-full transition-all duration-150 ease-in" onClick={() => { openEditModalHandler(item) }}>Edit</button>
            </div>
        </div>
    )
}