import Image from 'next/image'
import React, { useRef } from 'react'
import bigMarkIcon from '@/svgs/bigMark.svg'
import Link from 'next/link'
import { usePageContext } from '@/context/page-context'
import useClickOutside from '@/hooks/clickOutside'

const SubmitPopUp = () => {
    const { setIsSubmittedSuccessfully } = usePageContext();
    const ref = useRef<HTMLDivElement>(null)
    useClickOutside(ref, ()=>{
        setIsSubmittedSuccessfully(false)
    })
  return (
    <section className='w-full h-screen flex justify-center items-center fixed top-0 z-40 px-[20px]'>
        <div ref={ref} className='md:w-[488px] w-full h-[374px] p-[20px] md:p-[40px] gap-[10px] bg-white shadow-md '>
            <div className='w-full h-[294px] gap-[24px] flex flex-col justify-center items-center'>
                <div className='flex flex-col min-h-[59px] gap-[10px]'>
                    <h2 className='text-[25px] text-[#202430] font-bold leading-[30px] text-center'>Successfully Submit</h2>
                    <p className='text-base font-normal text-[#5A5D63] leading-[19.2px] text-center'>We will be reach out to you soon</p>
                </div>
                <Image src={bigMarkIcon} alt='' width={1000} height={1000} className='h-[121.88px] w-[121.88px]'/>
                <Link href={'/'} onClick={()=>{
                    setIsSubmittedSuccessfully(false)
                }} className='min-h-[57px] w-full rounded-[5px] py-[14px] px-[27px] gap-[10px] bg-[#8DDB90] text-white text-[18px] leading-[28.8px] font-bold text-center text-whites'>Home</Link>
            </div>
        </div>
    </section>
  )
}

export default SubmitPopUp
