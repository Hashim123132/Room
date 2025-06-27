'use client'

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import {StreamVideo, StreamVideoClient,} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const userId = "user-id";
const token = "authentication-token";


// we are wrapping our entire app t
 const StreamVideoProvider = ({ children }: {children:ReactNode}) => {
    //useState will use StreamVideoClient and videoClient is also restricted to get this value only
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const {user, isLoaded} = useUser();
    //checking if isLoaded have false value or user does not exist then don't move forward other wise move forward

    useEffect(() =>{
        //wait for the verified user to load and when it does start StreamVideo client
        if(!isLoaded || !user)
        return;
        
        if(!apiKey) throw new Error ('Stream API key missing')
        // making stream client (user)
        const client= new StreamVideoClient({
        apiKey,
        user:{
            id:user?.id,
            name: user?.username || user?.id,
            image:user?.imageUrl,
        },
        //Verify this user is indeed that user. tokenProvider: tokenProvider
        tokenProvider,
    })
    setVideoClient(client); 
    
  },[user, isLoaded])

   
  if(!videoClient) return 
  <Loader/>
    return (
      //donnot confuse with above client its a special property in streamVideo
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};

export default StreamVideoProvider