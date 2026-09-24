import { Converter } from "./Converter"
import { Header } from "./Header"
import { LanguagesSelectWrapper } from "./LanguagesSelectWrapper"

export const App = () => {
  return (
    <div className="
      min-h-screen bg-white flex flex-col items-center justify-center font-semibold
      md:bg-slate-50
      2xl:text-lg
    ">
      {/* two flex-grow spacers for optical centering on md+ screens */}
      <div className="flex-1 md:flex-[1]" />

      <LanguagesSelectWrapper />
      <Header />
      <Converter />

      <div className="flex-1 md:flex-[2.1]" />
    </div>
  )
}
