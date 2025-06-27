'use client'

import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";

const Meeting = ({params:{id}} : {params:{id:string}}) => {
 
  const {user, isLoaded} = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  //csutom hook to fetch call details by id
  const {call, isCallLoading} = useGetCallById(id);
  if (!isLoaded || isCallLoading) return <Loader />
  
  return (
    <main className="h-screen w-full ">
      
      {/* manages and provides context for the current video call/session  therefore we also used call={call}*/}
      <StreamCall   call={call}>
        {/* To apply or customize colors/fonts for the video call UI. we use Stream Theme*/}
        <StreamTheme>
          {!isSetupComplete ? (
            //waiting room or setup before joining the meeting
             <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>


          ):(
           <MeetingRoom />

          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}
export default Meeting