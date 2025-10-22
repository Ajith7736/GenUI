import React from 'react'

function Loading() {

    return (
        // Loading component
        <div className='w-screen h-screen bg-light-white dark:bg-dark-mediumblack flex justify-center items-center'>
            <div className="animate-spin inline-block size-5 lg:size-8 border-3 lg:border-6 border-light-white  border-t-light-black border-b-light-black rounded-full " role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )

}

export default Loading;
