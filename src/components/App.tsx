import { Converter } from "./Converter"
import { Header } from "./Header"

export const App = () => {
  return (
    <div className="
      min-h-screen bg-white flex flex-col items-center justify-center font-semibold overflow-y-scroll
      md:bg-slate-50 md:pb-[10%]
      2xl:text-lg
    ">
      <Header />
      <Converter />
    </div>
  )
}
