//this file has common layout of all the meeting modals (New Meeting, Join Meeting, etc.)

'use client'

import { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from "sonner"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const  MeetingTypeList = () => {
  
  const {user} = useUser();
  //instance for using call services in this useStreamVideo hook there is ".call" method which creates an empty object when used 
  const client = useStreamVideoClient(); 
  //store meeting values like date and description by default it shows current date due to new Date () 
  const [values, setValues] = useState({
    dateTime: new Date(),
    description:'',
    link:''

  })
 
//Call: It is a class/object provided by Stream's Video SDK, and it represents a video call session.

/*A Call object lets you:

Join a call

Start/stop recording

Mute/unmute participants

Access call metadata (id, participants, custom fields, etc.)
*/
  const [calldetails, setCallDetails] = useState<Call>()
  const createMeeting = async()=>{
    if(!client || !user) return
    try{
      //useless code the value of time is already defined above
        //make a room based on this id 
        // if(!values.dateTime){
        //    toast(
        //      'Please select date and time',
        // )
        // return;
        // }
        const id = crypto.randomUUID();
        
        //Give me an Call object for this id in the default call type 
        //different call types have different permissions only
        //.call method will have an object with multiple methods inside it for eg [.getOrCreate()]
        //.getorCreate method will only if we give data in the expected structure
        //we can make simpler version like this


        //await call.getOrCreate();
        //router.push(`/meeting/${id}`);
        //If you're not using a dashboard, upcoming meetings list, or sending invites — then yes, drop description and starts_at.


        const call = client.call('default', id);

        if(!call) throw new Error('Failed to create Call')
          //meeting time + description for meeting

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
            'Meeting Created successfully!',

            
      )
        }
    catch(error){
      console.log(error)
      toast(
       'Failed to create meeting',
      )
    }
  }


  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${calldetails?.id}`

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


      {/* shows a dialog box  */}
      {/* If calldetails is null show something. Otherwise, show something else." */}
      {!calldetails ? (
         
         // when we donot have  meeting details in schedule meeting do this below:
         <MeetingModal 

            isOpen={meetingState === 'isScheduleMeeting'}

            onClose={()=> setMeetingState(undefined)}
            title='Create Meeting'
            className='text-center'
            buttonText='Start Meeting'
            handleClick={createMeeting}
          >
            <div className='flex flex-col gap-2.5'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
              <Textarea className="border-none bg bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" 
              onChange={(e)=> {
                //since user 
                setValues({...values, description: e.target.value})
              }}
              />
            </div>
              <div className='flex w-full flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
                <ReactDatePicker selected={values.dateTime}
                //when we give different date from the default one change it from the default one to new one
                onChange={(date) => setValues({...values, dateTime:date!})}
                //Enables a time selector dropdown along with the calendar (showTimeSelect)
                showTimeSelect
                //what format of time in dropdown like 24 hour clock or 12 hour clock
                timeFormat='hh:mm aa'
                //timeIntervals show time in dropdown with 15 min gap
                timeIntervals={15}
                timeCaption='Time'
                //input field date format (partially affects calendar)
                dateFormat='MMMM d, yyyy h:mm aa'
                className='w-full rounded-sm bg-dark-3 p-2 focus:outline-none'
                />

              </div>

          </MeetingModal>
         
      ):(
           // when we do have  meeting details in schedule meeting do this below:

         <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created successfully!"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast('Link Copied!');
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}
      <MeetingModal 

        // if meetingState have precisely this 'isInstantMeeting' value then make "isOpen" true in Meeting Modal we have used this as prop(goto meetingModal)
        isOpen={meetingState === 'isInstantMeeting'}

        onClose={()=> setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />
      
      <MeetingModal 

        isOpen={meetingState === 'isJoiningMeeting'}

        onClose={()=> setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={()=>router.push(values.link)}
      >
        
        <Input 
        placeholder='Meeting Link'
        className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={(e) =>setValues({...values, link: e.target.value})}
        />

        
        
         </MeetingModal>

     </section> 
  )
}
export default  MeetingTypeList