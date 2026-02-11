import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react"

interface BaseProps {
    tailwind?: string
}
type ButtonProps =
    | (BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' })
    | (BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' })

export const Button = (props: ButtonProps) => {
    const baseStyles = 'bg-violet-500 text-white py-2.5 px-5 m-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-solid focus:outline-black focus:outline-2 cursor-pointer'
    if (props.as === 'a') {
        const { children, tailwind, ...rest } = props
        return (
            <a className={baseStyles + ' ' + tailwind} {...rest}>
                {children}
            </a>
        )
    }

    const { children, tailwind, ...rest } = props
    return (
        <button
            className={baseStyles + ' ' + tailwind}
            disabled={props.disabled}
            {...rest}
        >
            {children}
        </button>

    )
}