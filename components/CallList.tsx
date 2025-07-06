'use client'

import { useGetCalls } from "@/hooks/useGetCall"
import { Call, CallRecording } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MeetingCard from "./MeetingCard"
import Loader from "./Loader"
import { toast } from "sonner"

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
  const [recordings, setRecordings] = useState<CallRecording[]>([])
  const router = useRouter()

  // returns calls based on selected tab
  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls
      case 'recordings':
        return recordings
      case 'upcoming':
        return upcomingCalls
      default:
        return []
    }
  }

  // message when no calls are available
  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No previous Calls'
      case 'recordings':
        return 'No Recordings'
      case 'upcoming':
        return 'No Upcoming Calls'
      default:
        return ''
    }
  }

 

  // fetch and hydrate recordings
  useEffect(() => {
    if (type !== 'recordings') return

    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map(async (call) => {
            await call.get()
            const { recordings } = await call.queryRecordings()
            return recordings.map((rec) => ({
              ...rec,
              __originalCall: call,
            }))
          }) ?? []
        )
        setRecordings(callData.flat())
      } catch {
        toast('Try again later')
      }
    }
    fetchRecordings()
  }, [type, callRecordings])

  if (isLoading) return <Loader />

  const calls = getCalls()
  const noCallsMessage = getNoCallsMessage()

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls.length > 0 ? (
        calls.map((meeting: Call | (CallRecording & { __originalCall?: Call })) => {
          const isRecording = type === 'recordings'
          
         
          return (
            <MeetingCard
              key={(meeting as Call).id ?? (meeting as CallRecording).url ?? 'meeting'}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                'No Description'
              }
              date={
                isRecording
                  ? (meeting as CallRecording).start_time.toLocaleString()
                  : (meeting as Call).state?.startsAt?.toLocaleString() || 'No Date'
              }
              handleClick={
                isRecording
                  ? () => router.push((meeting as CallRecording).url)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
              buttonIcon1={isRecording ? '/icons/play.svg' : undefined}
              isPreviousMeeting={type === 'ended'}
              buttonText={isRecording ? 'play' : 'Start'}
              link={
                isRecording
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
            />
          )
        })
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList