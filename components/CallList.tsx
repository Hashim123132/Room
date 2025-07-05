'use client'

import { useGetCalls } from "@/hooks/useGetCall"
import { Call, CallRecording } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MeetingCard from "./MeetingCard"
import Loader from "./Loader"
import { toast } from "sonner"
import { getNormalizedParticipants } from "./getNormalizedParticipants";
import { useUser } from "@clerk/nextjs"


const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
  const [recordings, setRecordings] = useState<CallRecording[]>([])
  const router = useRouter()
  const { user } = useUser();

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

  useEffect(() => {
 const fetchRecordings = async () => {
  try {
    const callData = await Promise.all(
      callRecordings?.map(async (call) => {
        await call.get(); // <-- This hydrates the call's state including participants

        const { recordings } = await call.queryRecordings();
        return recordings.map((rec) => ({
          ...rec,
          __originalCall: call, // now call has participants loaded
        }));
      }) ?? []
    );

    const flattenedRecordings = callData.flat(); // flatten [[rec1, rec2], [rec3]]
    setRecordings(flattenedRecordings);
  } catch (_) {
    toast('Try again later');
  }
};

    if (type === 'recordings') fetchRecordings()
  }, [type, callRecordings])

  if (isLoading) return <Loader />

  const calls = getCalls()
  const noCallsMessage = getNoCallsMessage()

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | (CallRecording & { __originalCall?: Call })) => {
  const isRecording = type === 'recordings';

  // Use the original Call if it's a recording
const sourceCall = isRecording
  ? (meeting as CallRecording & { __originalCall?: Call }).__originalCall
  : (meeting as Call);
  // Get participants from source call
  const normalizedParticipants = sourceCall ? getNormalizedParticipants(sourceCall, user)
    : [];

  return (
        <MeetingCard
          key={(meeting as Call)?.id ?? (meeting as CallRecording)?.url ?? 'meeting'}
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
              ? () => router.push(`${(meeting as CallRecording).url}`)
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
             participants={normalizedParticipants}
             type={type}
        />
      );
    })

      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  )
}

export default CallList
