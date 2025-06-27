
'use client'

import { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from "sonner"

const  MeetingTypeList = () => {
  
  const {user} = useUser();
  const client = useStreamVideoClient(); 
  //store meeting values like date and description 
  const [values, setValues] = useState({
    dateTime: new Date(),
    description:'',
    link:''

  })

  const [calldetails, setCallDetails] = useState<Call>()
  const createMeeting = async()=>{
    if(!client || !user) return
    try{
        //make a room based on this id 
        if(!values.dateTime){
           toast(
             'Please select date and time',
        )
        return;
        }
        const id = crypto.randomUUID();
        const call = client.call('default', id);

        if(!call) throw new Error('Failed to create Call')
          //meeting time + description for meetinf

          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
          const description = values.description || 'Instant meeting'
        
          //if there is no room on that id create one or if it exists fetches the user to it
          await call.getOrCreate({
            data:{
              starts_at: startsAt,
              custom:{
                description
              }
            }
          })

          setCallDetails(call);
          
          if(!values.description){
            router.push(`/meeting/${call.id}`)
          }
     
          toast(
            'Meeting Created success fully',
      )
        }
    catch(error){
      console.log(error)
      toast(
       'Failed to create meeting',
      )
    }
  }

  const router = useRouter();
  //useState will only use these values no value beyond this in this case
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* since the layout is same for this element and each element serves different purpose so we are making reusable component with passing different props as they have different icons image and the like */}
     
   
      <HomeCard
        img='/icons/add-meeting.svg'
        title='New Meeting'
        description='Start an instant meeting'
        
        // when user clicks. "handleClick" gives order that "when user clicks run this function "setMeetingState('isInstantMeeting')" 
        
        handleClick={()=> setMeetingState('isInstantMeeting')}
        className='bg-orange-1'
      />
      <HomeCard 
         img='/icons/schedule.svg'
        title='Schedule Meeting'
        description='Plan your meeting'
        handleClick={()=> setMeetingState('isScheduleMeeting')}
        className='bg-blue-1'
      />
      <HomeCard 
         img='/icons/recordings.svg'
        title='View Recordings'
        description='Watch past meetings'
        handleClick={()=> router.push('/recordings')}
        className='bg-purple-1'
      />
      <HomeCard 
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='Via invitation link'
        handleClick={()=> setMeetingState('isJoiningMeeting')}
        className='bg-yellow-1'
      />


      <MeetingModal 

      // if meetingState have precisely this 'isInstantMeeting' value then make "isOpen" true in Meeting Modal we have used this as prop(goto meetingModal)
      isOpen={meetingState === 'isInstantMeeting'}

      onClose={()=> setMeetingState(undefined)}
      title='Start an Instant Meeting'
      className='text-center'
      buttonText='Start Meeting'
      handleClick={createMeeting}
      />
     </section>
  )
}
export default  MeetingTypeList