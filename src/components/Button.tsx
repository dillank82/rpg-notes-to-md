import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react"

interface BaseProps {
    tailwind?: string
    color?: 'color' | 'white'
}
type ButtonProps =
    | (BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' })
    | (BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' })

export const Button = (props: ButtonProps) => {
    const colorStyles = {
        color: 'bg-violet-500 text-white',
        white: 'bg-white text-black  border border-gray-100'
    }
    const baseStyles = 'py-2.5 px-5 m-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-solid focus:outline-black focus:outline-2 cursor-pointer shadow-md'

    const finalStyles = colorStyles[props.color || "color"] + ' ' + baseStyles
    if (props.as === 'a') {
        const { children, tailwind, ...rest } = props
        return (
            <a className={finalStyles + ' ' + tailwind} {...rest}>
                {children}
            </a>
        )
    }

    const { children, tailwind, ...rest } = props
    return (
        <button
            className={finalStyles + ' ' + tailwind}
            disabled={props.disabled}
            {...rest}
        >
            {children}
        </button>

    )
}