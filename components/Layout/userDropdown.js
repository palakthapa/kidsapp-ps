import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useAppState } from '../../store'
import { logOut } from '../../store/reducers/userProfileReducer';

export default function UserDropdown() {

  const [state, dispatch] = useAppState();

  const logoutHandler = async function () {
    dispatch({
      type: "setLoadingState",
      payload: true
    });

    await logOut();

    dispatch({
      type: "unsetUserProfile"
    });
  }

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="w-full p-1 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <Image src="/images/user-avatar.png" alt="User" width={35} height={20} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className='w-full text-left text-black text-sm'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-gray-200' : ''
                      } text-black text-left w-max rounded-md px-4 py-3 text-sm`}
                    onClick={() => { logoutHandler(); }}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>

          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
