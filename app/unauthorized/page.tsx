import React from 'react'
import Link from 'next/link'


const UnauthorizedPage = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center bg-white'>
      <h1 className='text-4xl font-bold text-gray-900 mb-3'>Access Denied</h1>
      <p className='text-gray-500 mb-8'>You don't have permission to view this page</p>
      <div className='flex gap-4'>
        <Link href='/login'
        className='px-5 py-2.5 bg-green-700 text-white round-xl text-sm font-medium hover:bg-green-600 rounded-2xl transition'>
          Student Login
        </Link>
         <Link href='/'
        className='px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber400 transition'>
            Home
        </Link>
        {/*
        <Link href="/"
        className='px-5 py-2.5 bg-teal-700 text-white rounded-x1 text-sm font-medium hover:bg-teal-600 transiton'
        >
          Home
        </Link> 
        */}
      </div>
    </div>
  )
}

export default UnauthorizedPage