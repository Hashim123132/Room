// for upcomming meetings, prev meetings, and recordings we are making a component 

'use client'
import { useGetCalls } from "@/hooks/useGetCall"
import { Call, CallRecording } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MeetingCard from "./MeetingCard"
import Loader from "./Loader"
import { toast } from "sonner"

const CallList = ({type}:{type:'ended' | 'upcoming' | 'recordings'}) => {
  const {endedCalls, upcomingCalls, callRecordings, isLoading}=  useGetCalls()
  //since recordings is different from upcoming and previous therefore we are going to make it here and not in custom hook useGetCalls
  //moreover CallRecordings is another stream interface similar to "Call[]"interface it also gives a blueprint for storing recording only 

  const [recordings, setRecordings] = useState<CallRecording[]>([])
  const router = useRouter();
  
  
  const getCalls =  ()=>{
    
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;  
      default:
        return [];    
    
    
    }
  }
  
  const getNoCallsMessage =  ()=>{
    
    switch (type) {
      case 'ended':
        return 'No previous Calls';
      case 'recordings':
        return 'No Recordings';
      case 'upcoming':
        return 'No Upcoming Calls';  
      default:
        return [];    
    
    
    }
 }

 useEffect(() => {
  try {
    
  } catch (error) {
    
  }
  const fetchRecordings = async ()=>{
    //"?? = If the result of callRecordings?.map(...) is null or undefined, use [] (empty array) instead
    //queryRecordings is a method of CallRecording interface which fetches recordings of that call by sorting through the callRecordings array( this array has calls value inside it)
    /*
    For all Call objects in callRecordings, fetch their recordings only in parallel"
    If callRecordings is missing, use an empty array (so nothing breaks)
    callData becomes an array of { recordings: CallRecording[]  
    */ 
   try {
     const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],);
      // sample structure of what queryRecordings gives
  //      recordings: [
  //   {
  //     id: "rec_1234567890",
  //     url: "https://cdn.stream.io/recordings/rec_1234567890.mp4",
  //     start_time: new Date("2025-07-02T10:00:00Z"),
  //     end_time: new Date("2025-07-02T10:30:00Z"),
  //     duration: 1800, // in seconds
  //     filename: "Meeting-July-2-2025.mp4",
  //     size: 50240000, // in bytes
  //     mime_type: "video/mp4",
  //     created_at: new Date("2025-07-02T10:31:00Z"),
  //     type: "composite", // or "audio", etc.
  //     resolution: "1280x720"
  //     // ... more fields may exist depending on API version
  //   },
  // ]
    //[[{rec1}],[{rec2}],[{rec3}]]
    const recordings = callData.filter(recordingData => recordingData.recordings.length > 0) .flatMap(recordingData => recordingData .recordings)
     // flatMap do this [ {rec1}, {rec2}, {rec3} ]

     setRecordings(recordings);
   } catch (error) {
    toast('Try again Later')
    
   }
  }

  if(type === 'recordings') fetchRecordings();

},[type, callRecordings])

 if(isLoading) return <Loader />
 //calls holds value of array like endedCalls etc
 const calls = getCalls();
 const noCallsMessage = getNoCallsMessage(); 

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* calls have an array coming from getCalls() we mapped it each element (object in this case) is named meeting. This element can be of two category */}
      {/* the meetingCard will be mapped after knowing the type */}
      {calls && calls.length > 0 ? calls.map((meeting: Call| CallRecording )=>(
      //  this component has props which makes us reuse the MeetingCard componennt
       <MeetingCard
          key={
            (meeting as Call)?.id ??
            (meeting as CallRecording)?.url ??
            meeting 
    } 
          
            icon={
              //if type is ended then use previous icon and vice versa
              type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg': '/icons/recordings.svg'
            }
           title={ (meeting as Call).state?.custom?.description || (meeting as CallRecording).filename?.substring(0, 20) ||
                   'No Description'}
           
            date={  type === 'recordings' ?  (meeting as CallRecording).start_time.toLocaleString() : (meeting as Call).state?.startsAt?.toLocaleString() ||  'No Date'}   //startsAt and starts_time is equal
           
           // If the meeting is a recording:
           handleClick={type === 'recordings' ? ()=> router.push(`${(meeting as CallRecording).url}`) : 
           //If the meeting is an upcoming or ended call:
           ()=> router.push(`/meeting/${(meeting as Call).id}`)}
           
           
           // just for recordings since those can be played and should've an Icon of play
            buttonIcon1={type === 'recordings' ? '/icons/play.svg':undefined}
            isPreviousMeeting={type === 'ended'}
           
            // If type === 'recordings' → show "play"
            //Otherwise → show "Start"
            
            buttonText={type === 'recordings' ? 'play' : 'Start'}
           
           
            
            //If type === 'recordings', we use the external meeting.url.
            // Otherwise, we generate a custom app route using the call id.
            
            link={type === 'recordings' ?( meeting as CallRecording).url :
              
              `${process.env.NEXT_PUBLIC_BASE_URL }/meeting/${(meeting as Call).id}`}
        
        
        />
      )):(
        <h1>{noCallsMessage}</h1>
      )}

    </div>
  )
}
export default CallList


//CallRecording data structure

// {
//   url: "https://.../recording.mp4",
//   start_time: Date,
//   end_time: Date,
//   duration: number,
//   ...etc
// }