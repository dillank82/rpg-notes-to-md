import { Globe } from "lucide-react"
import { LanguagesSelect } from "./LanguagesSelect"

export const LanguagesSelectWrapper: React.FC = () => {
    return (
        <div className="absolute top-5 right-5 flex flex-row">
            <Globe />
            <LanguagesSelect/>
        </div>
    )
}