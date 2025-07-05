import { Call, StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { UserResource } from "@clerk/types";
//gives array of participant ids
export const getNormalizedParticipants   = (
  meeting: Call,
  user?: UserResource | null
): string[] => {
  const streamParticipantIds = Array.from(
    meeting?.state?.participants?.values() || []
  ).map((p: StreamVideoParticipant) => p.userId);

  const userId = user?.id;

  // Add current user if not already in the participant list
  const allParticipantIds = new Set([...streamParticipantIds]);

  if (userId && !allParticipantIds.has(userId)) {
    allParticipantIds.add(userId);
  }

  return Array.from(allParticipantIds);
};
