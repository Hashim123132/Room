"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
  <Sonner
  theme={theme as ToasterProps["theme"]}
  position="top-center" // 👈 Add this line
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "!bg-[rgb(28,31,46)] text-white shadow-lg border border-white flex flex-col items-center",
        title: "!font-extrabold !text-center",
        description: "group-[.toast]:text-muted-foreground  !bg-[rgb(28,31,46)]",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
  }}
  {...props}
/>

  )
}

export { Toaster }
