//The callist component render items here

import CallList from "@/components/CallList"

const upcoming = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
        <h1 className="text-3xl font-bold">
            upcoming
        </h1>
        

        <CallList type='upcoming'></CallList>
        </section>  
  )
}
export default upcoming