import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    tailwind?: string
    isLoading?: boolean
}
export const Button = ({ children, tailwind, isLoading, ...props }: ButtonProps) => {
    return(
        <button 
            className={tailwind}
            disabled={isLoading}
            {...props}
        >
            {children}
        </button>
    )
}