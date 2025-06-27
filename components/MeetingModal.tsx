"use client"

import { ReactNode } from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"


//since we are using typescript we have to tell what these props types are 
interface MeetingProps{
  className?:string
  title:string
  buttonText?: string
  onClose: ()=> void
  isOpen:boolean
  handleClick?:()=> void;
  children?: ReactNode; 
  image?:string;
  buttonIcon?:string
  
  
}
//Props
const MeetingModal = ({    
isOpen,
onClose,
title,
className,
children,
buttonText,
image,
buttonIcon,
handleClick,}:MeetingProps) => {
  return (
    
    //Using shadcn for dialog box and they built in "open"property in which we have {isopen} prop which is serving as boolean

        <Dialog  open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
              <DialogHeader>


              <div className="flex flex-col gap-6">
                {image &&(
                  <div className="flex justify-center">
                    <Image
                    src={image}
                    alt='image'
                    height={72}
                    width={72}
                    />
                  </div>
                )}
                <DialogTitle asChild>

                    <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>
                      {title}
                    </h1>
                </DialogTitle>
                {children}

                
                <Button className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={handleClick}>
                  {buttonIcon &&(
                    <Image 
                    src={buttonIcon}
                    alt="button icon"
                    width={13}
                    height={13}
                    />
                  )}&nbsp;
                {buttonText || 'Schedule Meeting'}
                
                </Button>
              </div>
          </DialogHeader>
        </DialogContent>
        </Dialog>  
    )
}
export default MeetingModal