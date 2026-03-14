'use client' // <- changes our component to render on browser side


import {useState} from 'react';

const Counter = () =>{
  
  const [count,setCount] = useState(0);

  return(
    <div className='w-[97vw] h-[97vh] flex flex-col gap-4 -mt-10 justify-center place-items-center'>
     
      <a href='/wallet/'>
      <button className='border border-amber-400 rounded-sm cursor-pointer p-1 hover:bg-slate-900 active:text-green-200'>Go to Sepolia wallet Checker</button>
      </a>
    </div>    

  )
}

export default Counter