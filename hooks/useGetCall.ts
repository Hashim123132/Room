import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = ()=>{
    // This tells TypeScript: “calls will be an array containing objects of type Call.
    //You're telling TypeScript exactly what this variable should be:

        //“An array of objects shaped like the Call interface.”


    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const client = useStreamVideoClient();
    const {user}  = useUser()

    useEffect(()=>{
        //since fetching of calls is aync and useeffect does not have async functionality
        const loadCalls = async() =>{
            if(!client || !user?.id) return;
            
            setIsLoading(true);
            try {
                //the method returns "calls" array of object  based on the requirements mentioned inside it
                
                const {calls} = await client.queryCalls({
                    sort:[{field: 'starts_at', direction: -1}],
                    //requirements for queryCalls to give array of object
                    filter_conditions:{
                        starts_at:{$exists: true},
                        $or:[
                            {created_by_user_id: user.id},
                            {members:{$in:[user.id]}}
                        ]

                    }
                });
                    setCalls(calls);

            } catch (error) {
                console.log(error)
            }finally{
                setIsLoading(false);
            }
        }
        loadCalls()

    }, [client, user?.id])

    const now = new Date();
//Keep calls that either already started in the past, or have a recorded end time.
//filter() method expects a single condition that returns true or false.
//this is used when u want to Go through an array and keep only the items that meet a condition.
//array.filter(item => condition);
//filtering inside the hook is best practice if we dont return these varibles then we have to make them and filter them in everycomponent that uses hook


//SAMPLE DATA STRUCTURE FOR calls array object



// const calls: Call[] = [
//   {
//     id: "abc123",
//     created_by_user_id: "user_123",
//     state:  {
//       startsAt: "2025-07-02T10:00:00Z",
//       endedAt: "2025-07-02T11:00:00Z"
//              }
//   },

//   {
//     id: "xyz789",
//     created_by_user_id: "user_456",
//     state: {
//       startsAt: "2025-07-03T09:00:00Z",
//       endedAt: null
//            }
//   }
// ];



    //An array of past or ended meetings these meetings will be in object. that is the value it holds
    const endedCalls= calls.filter(({state: {startsAt, endedAt}}: Call)=>{
         //if its lesser than now(current date and time) then meeting is already started or the time is ended(ended === true) then it is a meeting that has ended
        return( startsAt && new Date (startsAt)< now || !!endedAt)                                                 
    })
     
    const upcomingCalls= calls.filter(({state: {startsAt}}: Call)=>{
        //if its greater than now(current date and time) then it is upcoming call
        return( startsAt && new Date (startsAt) > now )                                                 
    }) 

    
    return{
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading
    }
    
}



