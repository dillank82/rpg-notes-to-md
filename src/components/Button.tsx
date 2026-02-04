import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    tailwind?: string
    isLoading?: boolean
}
export const Button = ({ children, tailwind, isLoading, ...props }: ButtonProps) => {
    return(
        <button 
            className={
                'bg-blue-500 text-white py-2.5 px-5 m-2 rounded-lg'
                +' '+'disabled:bg-gray-400 disabled:cursor-not-allowed'
                +' '+'focus:outline-solid focus:outline-black focus:outline-2'
                +' '+tailwind
            }
            disabled={isLoading}
            {...props}
        >
            {children}
        </button>
    )
}