//this component MeetingCard is a reusable UI card for displaying a meeting's details — like title, date, icons, avatars, and action buttons.
'use client'
import  Image  from "next/image"
import { Button } from "./ui/button";
import { toast } from "sonner";

//dynamic content passed to each card
interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  participants: string[]; // just for count, no avatar display
    type?: 'ended' | 'upcoming' | 'recordings'; // <-- NEW

}



const MeetingCard = ({
  title,
  date,
  icon,
  handleClick,
  buttonIcon1,
  isPreviousMeeting,
  buttonText,
  link,
  type,
   participants = [],

}:MeetingCardProps) => {
  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">

      <article className="flex flex-col gap-5">
        <Image src={icon} alt='upcoming' width={28} height={28}/>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
     
   <article className="flex justify-between items-center w-full">
 <p className="text-sm text-gray-400">
  {type === 'upcoming'
    ? 'Meeting soon be live on the scheduled date!'
    : `${participants.length} ${participants.length === 1 ? 'person has' : 'people have'} joined`}
</p>

  {!isPreviousMeeting && (
    <div className="flex gap-2">
      <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
        {buttonIcon1 && (
          <Image src={buttonIcon1} alt='feature' width={20} height={20} />
        )}
        &nbsp; {buttonText}
      </Button>

      <Button
        onClick={() => {
          navigator.clipboard.writeText(link);
          toast('Link copied!');
        }}
        className="bg-dark-4 px-6"
      >
        <Image
          src="/icons/copy.svg"
          alt="feature"
          width={20}
          height={20}
        />
        &nbsp; Copy Link
      </Button>
    </div>
  )}
</article>
    </section>
  );
};
export default MeetingCard;