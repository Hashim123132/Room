'use server'
//since we are in server we are using node sdk
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async ()=>{
    const user = await currentUser();
    if(!user) throw new Error ('User is not logged in')
    if(!apiKey) throw new Error ('No API Key')
    if(!apiSecret) throw new Error ('No API secret')

    const client = new StreamClient(apiKey, apiSecret);
    
    //Token expiration after 1hr
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60
    
    //when the token is issued
    const issued = Math.floor(Date.now() / 1000) - 60;

    const token = client.createToken(user.id, exp, issued)
    return token

}