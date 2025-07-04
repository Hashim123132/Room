//this component MeetingCard is a reusable UI card for displaying a meeting's details — like title, date, icons, avatars, and action buttons.
'use client'
import  Image  from "next/image"
import { cn } from "@/lib/utils";
import { avatarImages } from "@/constants";
import { Button } from "./ui/button";
import { toast } from "sonner";

//dynamic content passed to each card
interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?:boolean;
  buttonIcon1?:string;
  buttonText?:string;
  handleClick:()=> void;
  link: string;
}


const MeetingCard = ({
  title,
  date,
  icon,
  handleClick,
  buttonIcon1,
  isPreviousMeeting,
  buttonText,
  link

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
      <article className={cn('flex justify-center relative', {})}>
        <div className="relative flex w-full max-sm:hidden">

          {avatarImages.map((img, index)=>(
            <Image
                  key={index}
                  src={img}
                  alt="attendees"
                  width={40}
                  height={40}
                  //Adds "absolute" to avatar images except the first one(latest one joining call) (for overlap effect).
                  className={cn('rounded-full',{ absolute: index>0})}
                  style={{top:0, left: index * 28}}
                  />
          ))}
          {/* After the avatars, there's a hard-coded +5 badge (shows more people).*/}
          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4 ">+5</div>

        </div>
        {!isPreviousMeeting && (
          <div className="flex gap-2">
              <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
                {/* Its for safety here.It also works without "{buttonIcon1 &&("  */}
                {/* "Image" will still render */}
                {buttonIcon1 &&(
                  <Image src={buttonIcon1} alt='feature' width={20} height={20} />
                )}
                &nbsp; {buttonText}
              </Button>
              
              <Button onClick={()=>{navigator.clipboard.writeText(link);
                toast(
                  'link copied!'
                );
              }} 
              className="bg-dark-4 px-6"
              >
                <Image src='/icons/copy.svg'
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