import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallById = (id: string | string[]) =>
{   
    //the call variable is restricted to store a call object only
    const [call, setCall] = useState<Call>()
    const [isCallLoading, setIsCallLoading] = useState(true)
    
    //connection manager
    const client = useStreamVideoClient();

    useEffect( () =>{
        if(!client) return; 
//cannot write regular async await code in useEffect unless you declare it as new function.
        const loadCall = async()=>{
            //only the client.queryCalls() can fetch the actual data linked to the ID mentioned above
            //.queryCalls returns an array named "calls" if we donot use destructuring then it will look like this:
                       // const result = await client.queryCalls(...);
                     // now you access result.calls

            const {calls} = await client.queryCalls({
                //same id passed down but using filter_condition because its part of syntax and it is for flexible criteria given to client.queryCalls meaning you can fetch call not only on id but also on participats, status etc.
                filter_conditions:{
                    id
                }
            })
            // If the calls array is not empty, take the first call object (calls[0]) and store it in call using setCall
            if(calls.length > 0) setCall(calls[0])

            setIsCallLoading(false)
        }

        loadCall();

    }, [client, id] )

    return {call, isCallLoading}

}