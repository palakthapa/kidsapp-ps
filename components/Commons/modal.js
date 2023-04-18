import { useState } from "react";

const Modal = ({ showModal, setShowModal, acceptText, rejectText, onAccept, onReject, actionsDisabled, children }) => {
    const acceptHandler = () => {
        if (onAccept) onAccept();
        else setShowModal(false);
    }

    const rejectHandler = () => {
        if (onReject) onReject();
        else setShowModal(false);
    }

    return (showModal ?
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {children}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:grayscale disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={acceptHandler}
                            disabled={actionsDisabled}
                        >
                            {acceptText || "Confirm"}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:grayscale disabled:cursor-not-allowed sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={rejectHandler}
                            disabled={actionsDisabled}
                        >
                            {rejectText || "Cancel"}
                        </button>
                    </div>
                </div>
            </div>
        </div> : null
    );
};

export default Modal;
