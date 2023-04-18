import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Carousel } from "flowbite";
import Layout from '../../../components/Layout'
import { useAppState } from '../../../store'
import SoundButton from '../../../components/Commons/soundButton';
import Icon from '../../../components/Commons/icon';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';


export default function PnSScreen() {

    const [state, dispatch] = useAppState();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const moduleId = router.query.moduleId;

    const [currentModule, setCurrentModule] = useState(null);
    const [prevModuleId, setPrevModuleId] = useState(null);
    const [nextModuleId, setNextModuleId] = useState(null);

    useEffect(() => {
        if (!state.userProfile) return;
        setCurrentModule(state.modulesData?.modules?.find((module, i) => {
            if (module.module_id === moduleId) {
                if (state.modulesData.modules[i - 1]) setPrevModuleId(state.modulesData.modules[i - 1].module_id);
                else setPrevModuleId(null);
                if (state.modulesData.modules[i + 1]) setNextModuleId(state.modulesData.modules[i + 1].module_id);
                else setNextModuleId(null);
                return true;
            } else return false;
        }) || null);
        setLoading(false);
    }, [moduleId]);

    const handleModuleChange = function (id) {
        if (!id) return;
        setLoading(true);
        router.replace("/pns/screen/" + id);
    }

    const nextBtnRef = useRef(null);
    const prevBtnRef = useRef(null);
    const imagesParentRef = useRef(null);

    useEffect(() => {

        if (currentModule) {
            const items = [];
            currentModule.images.forEach((image, i) => {
                items.push({
                    position: i,
                    el: imagesParentRef.current?.childNodes[i]
                });
            });

            const carouselOpts = {
                defaultPosition: 0,
                interval: 8000,
                indicators: {
                    activeClasses: 'bg-gray-300 dark:bg-gray-600',
                    inactiveClasses: 'bg-white-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-800',
                    items: items
                }
            };

            const carousel = new Carousel(items, carouselOpts);
            carousel.cycle();

            prevBtnRef.current?.addEventListener('click', () => {
                carousel.prev();
            });

            nextBtnRef.current?.addEventListener('click', () => {
                carousel.next();
            });
        }
    }, [currentModule])

    return (
        <Layout title="Learning Screen">
            <div className='w-full h-full flex px-10'>
                <div className='h-full flex items-center group'>
                    <button className='w-[50px] p-2 group-hover:h-full bg-gray-100 group-hover:bg-gray-200 bg-opacity-50 group-hover:bg-opacity-80 rounded-md'
                        onClick={() => { handleModuleChange(prevModuleId) }}
                        disabled={!prevModuleId}
                    >
                        <Icon icon={faChevronLeft} />
                    </button>
                </div>
                <div className='w-4/5 h-full m-auto'>
                    {loading ? <div>Loading....</div> :
                        (currentModule ?
                            <>
                                <h1 className='text-2xl font-bold text-center mb-5'>
                                    {currentModule.name}
                                </h1>
                                <div className='w-full h-[calc(100%-52px)]'>
                                    <div className='relative w-full h-3/4 flex flex-col justify-around items-center'>
                                        <div className='absolute right-0 top-0 flex'>
                                            <SoundButton src={currentModule.sound_url} />
                                        </div>
                                        <div className='w-full h-full flex justify-around items-center'>
                                            <div className='w-1/2 h-full flex flex-col items-center'>
                                                {currentModule.images.length > 0 ?
                                                    <div id="indicators-carousel" className="relative w-full h-full" data-carousel="static">
                                                        {/* Carousel wrapper */}
                                                        <div className="relative w-full h-full overflow-hidden rounded-lg" ref={imagesParentRef} >
                                                            {currentModule.images.map((image, i) => {
                                                                return (
                                                                    <div key={i} className="hidden duration-700 ease-in-out" data-carousel-item={i === 0 ? "active" : ""}>
                                                                        <img src={image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt={"Image " + i} />
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        {/* Slider indicators */}
                                                        <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                                                            <button type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                                                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
                                                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
                                                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
                                                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
                                                        </div>
                                                        {/* Slider controls */}
                                                        <button type="button" className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev ref={prevBtnRef}>
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                                                <Icon icon={faChevronLeft} className={"w-5 h-5 text-gray-500 sm:w-6 sm:h-6 dark:text-gray-400"} />
                                                                <span className="sr-only">Previous</span>
                                                            </span>
                                                        </button>
                                                        <button type="button" className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next ref={nextBtnRef}>
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                                                <Icon icon={faChevronRight} className={"w-5 h-5 text-gray-500 sm:w-6 sm:h-6 dark:text-gray-400"} />
                                                                <span className="sr-only">Next</span>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-2/5 h-1/4 m-auto mt-5 text-center font-semibold text-lg'>
                                        {currentModule.content}
                                    </div>
                                </div>
                            </>
                            : <div>No item available...</div>)
                    }

                </div>
                <div className='h-full flex items-center group'>
                    <button className='w-[50px] p-2 group-hover:h-full bg-gray-100 group-hover:bg-gray-200 bg-opacity-50 group-hover:bg-opacity-80 rounded-md'
                        onClick={() => { handleModuleChange(nextModuleId) }}
                        disabled={!nextModuleId}
                    >
                        <Icon icon={faChevronRight} />
                    </button>
                </div>
            </div>
        </Layout>
    )
}