import Image from 'next/image'
import { useEffect, useState } from 'react'
import ModuleCards from '../../components/Admin/moduleCards'
import UsersTable from '../../components/Admin/usersTable'
import CreateModuleModal from '../../components/Commons/modal'
import Layout from '../../components/Layout'

export default function AdminScreen() {

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

    })
    return (
        <Layout title="Admin Console">
            <div className='w-full flex justify-around'>
                <div className="w-[55%]" >
                    <h1 className="text-2xl text-center mb-2 font-bold">Users Table</h1>
                    <UsersTable />
                </div>
                <div className='w-[35%]'>
                    <h1 className="text-2xl text-center mb-2 font-bold">Modules</h1>
                    <ModuleCards />
                </div>
            </div>
            {/* <button onClick={() => { setShowModal(state => !state) }}>Show Modal</button>
            <CreateModuleModal showModal={showModal} setShowModal={setShowModal} >
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Modal Title</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">Modal content goes here.</p>
                    </div>
                </div>
            </CreateModuleModal> */}
        </Layout>
    )
}
