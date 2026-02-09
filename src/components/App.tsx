import { Converter } from "./Converter"
import { Header } from "./Header"

export const App = () => {
  return (
    <div className="
      h-screen bg-slate-50 flex flex-col items-center font-semibold
      lg:justify-center lg:pb-[12.5%]
      2xl:text-lg
    ">
      <Header />
      <Converter />
    </div>
  )
}
