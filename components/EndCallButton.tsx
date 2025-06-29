'use client'

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


const EndCallButton = () => {
//we are getting call object from this useCall()
  const call = useCall();
  const router=useRouter();
  const{useLocalParticipant} = useCallStateHooks();

  // localParticipant  = current user (you)
  const localParticipant = useLocalParticipant();
  /*This checks if the current user (you) is the owner/creator of the call.
    localParticipant — makes sure you're in the call.
    call?.state.createdBy — checks if the call has a createdBy user.
    localParticipant.userId === call.state.createdBy.id
  */

  const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;

  if(!isMeetingOwner)
    return null


  return (

    <Button onClick={async ()=>{
      await call.endCall();
      router.push('/')
      
    }}
    className="bg-red-500"
    >
    End Call for everyone
  </Button>
  )

}
export default EndCallButton