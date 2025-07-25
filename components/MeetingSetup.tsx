//in this file we are basically making a room which shown to us just before connecting to meeting room 

"use client"
import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

const MeetingSetup = ({setIsSetupComplete }: { setIsSetupComplete:(value:boolean) => void}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
 
  const call = useCall();
if(!call){
  throw new Error('useCall must be used within StreamCall component')
}
//by default you join with mic and camera enabled until u click on a checkbox which allows you to join without it
const camera = call?.camera;
const microphone = call?.microphone;  
  
useEffect(() => {
    if (isMicCamToggledOn) {
      camera?.disable();
      microphone?.disable();
    } else {
      camera?.enable();
      microphone?.enable();
    }
  }, [isMicCamToggledOn, camera, microphone]);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      {/* your vid from camera */}
      <VideoPreview/>
        <div className="flex h-16 items-center justify-center gap-3">
          <label className="flex items-center justify-center gap-2 font-medium">
           {/* this will make a checkbox in which you check it for your camera and mic to be on or off */}
            <input 
            type="checkbox" 
            checked={isMicCamToggledOn} 
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
            />
            Join with mic and camera off
          </label>
          <DeviceSettings />
        </div>
        <Button className="rounded-md bg-green-500 px-4 py-2.5"
          onClick={() => {call.join()
            setIsSetupComplete(true);

          }}
        >
          Join Meeting
        </Button>

      </div>
  )
}
export default MeetingSetup