'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


const MobileNav = () => {
    //for knowing which one is active
    const pathname = usePathname();
  return (
    <section className='w-full max-w-[264px]'>
        <Sheet>
            <SheetTrigger asChild>
                {/* hamburger image and its styling */}
                <Image
                    src={'/icons/hamburger.svg'}
                    width={32}
                    height={32}
                    alt='hamburger'
                    className="cursor-pointer sm:hidden"
                
                />

            </SheetTrigger>
            <SheetContent side='left' className="bg-dark-1 text-white">
                 <Link 
                    href='/'
                    className="flex items-center gap-1"
                  >
                    <Image
                    src={'/icons/logo.svg'}
                    width={32}
                    height={32}
                    alt='Room Logo'
                    className="max-sm:size-10"

                    />
                    <p  className='text-[26px] font-extrabold text-white '>Room</p>

                </Link>
                <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                    
                        <section className="flex h-full flex-col gap-6 pt-16 text-white">
                            {/* mapping for links as soon as user click on a link sheet will be closed  */}
                            {sidebarLinks.map((link) => {
                                const isActive =
                                    pathname === link.route;
                                return (
                                    <SheetClose asChild key={link.label}>
                                        <Link
                                        href={link.route}
                                        className={cn(
                                            "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                                            {
                                            "bg-blue-1": isActive,
                                            }
                                        )}
                                        >
                                        <Image
                                        src={link.imgUrl}
                                        alt={link.label}
                                        width={20}
                                        height={20}
                                        />
                                        <p className="font-semibold">
                                            {link.label}
                                        </p>
                                        </Link>
                                </SheetClose>
                                );
                                })}
                        </section>
                </div>
            </SheetContent>
        </Sheet>


    </section>
  )
}
export default MobileNav