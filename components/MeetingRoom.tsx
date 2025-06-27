//in this file we are basically makeing meeting room literally.

import { cn } from "@/lib/utils"
import { CallControls, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout } from "@stream-io/video-react-sdk"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Search, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"

// CallLayoutType can only be one of these two string values:
type CallLayoutType = 'grid' | 'speaker-left'| 'speaker-right'
const MeetingRoom = () => {
  const searchParams = useSearchParams()
  const isPersonaRoom = !!searchParams.get('personal')
 
  //setLayout only lowercases the speaker-left etc
 const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
 const [showParticipants, setShowParticipants] = useState(false)
 
 const CallLayout = ()=>{
  switch (layout) {
    case 'grid':
      return <PaginatedGridLayout />
    case 'speaker-right':
      return <SpeakerLayout participantsBarPosition='left'/>
      
        default:
      return <SpeakerLayout participantsBarPosition='right'/>
      
  }
 }
 
 return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
      <CallLayout/>
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden', 
          {'show-block': showParticipants})}>
            {/* When the user clicks a close button inside the participants list it will:
           
            1)  Call onClose()

            2) That will run setShowParticipants(false)

            3) Which will hide the participants list from the screen*/}
            
            <CallParticipantsList onClose={()=>
              setShowParticipants(false)}
            />
          </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls />
        {/* used a custom dropmenu from shadcn ui library */}
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger>

                  <LayoutList size={20}
                  className="text-white cursor-pointer rounded-2xl  hover:bg-[#4c535b] h-[30px] w-[25px]"/>
              </DropdownMenuTrigger>
          </div>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
              {/* array may capital isliye likha ta k neeche dropmenu may captital nazar ay aur dropmenu say phly code may isko layout variable k liye lowercase krdiya */}
              {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index)=>(
                <div key={index}>
                  <DropdownMenuItem className="cursor-pointer"
                  onClick={()=>{
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }}
                  >
                    {item}
                   </DropdownMenuItem>

                   <DropdownMenuSeparator className="border-dark-1" />
                </div>
              ))}
           
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton/>
        <button onClick={()=>setShowParticipants((prev)=>!prev)}>
              <div className="cursor-pointer rounded-2xl bg-[#19234d] hover:[#4c535b]">
                <Users size={20} className='text-white'/>
              </div>
              
        </button>
        {!isPersonaRoom &&<EndCallButton />}
      </div>
    </section>
  )
}
export default MeetingRoom