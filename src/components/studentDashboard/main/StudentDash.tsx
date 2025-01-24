import React from 'react'
import SemesterScore from '../components/SemesterScore'
import AssignmentAssigned from '../components/AssignmentAssigned'
import LeaderShipScore from '../components/LederShipScore'
import ResumeHereSection from '../components/ResumeHereSection'

export default function StudentDash() {
  return (
      <div  className='p-5 flex flex-col gap-6  bg-bakground-gradient'>
        <SemesterScore/>
        <div className='w-full flex gap-5 max-lg:flex-col'>
          <AssignmentAssigned/>
          <LeaderShipScore/>
        </div>
        <ResumeHereSection/>
      </div>
  )
}
