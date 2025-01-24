import Image from 'next/image'
import React from 'react'
import { useAssignmentScorePageModel } from '../../models/AssignmentScore'
export default function AssignmentAnalysis() {
    const {AssignmentAnalysisTable} = useAssignmentScorePageModel();
  return (
    <div className='flex flex-col gap-4 h-full justify-between'>
      <div className='flex justify-between items-center '>
        <div className='text-base font-semibold'>Assignment Analysis</div>
        <button className='max-w-[115px] w-full px-[14px] py-[8px] text-xs rounded-md bg-[#0D0D0D]' >Raise a Doubt</button>
      </div>
    <div className='bg-barBgColor flex gap-2 w-full rounded-md items-center p-3' >
        <Image src={"/tickwithBg.svg"} alt='checkImage' height={24} width={24}/>
        <div className='text-sm'>Impressive effort! You’re now 10% better than your last assignment!</div>
    </div>
    
    <div className='w-full flex flex-col gap-3'>
        {AssignmentAnalysisTable.map((item)=>(
            <div className='w-full text-xs flex gap-5' key={item.title}>
                <div className='w-full min-w-[150px] max-w-[160px] max-[430px]:min-w-[100px] font-semibold'>{item.title}</div>
                <div>{item.description}</div>
            </div>
        ))}
    </div>

    <div className='flex gap-5 justify-between w-full '>
        {["Raise Assignment", "Download Notes"].map((item)=>(
            <button className='rounded-md flex w-full max-w-[295px] text-[#C7CCF8] border text-sm border-[#C7CCF8] justify-center py-3 items-center' key={item}>{item}</button>
        ))}
    </div>
    </div>
  )
}
