import { ReactNode } from "react"

interface MessageBoxProps {
    variant?: 'normal' | 'error' | 'warning'
    children: ReactNode
}
export const MessageBox = ({ variant = 'normal', children }: MessageBoxProps) => {
    const styles = {
        base: 'p-6 border-2 rounded-lg m-1',
        normal: 'bg-gray-50 border-gray-200 text-gray-800',
        error: 'bg-rose-50 border-rose-400 text-rose-600',
        warning: 'bg-amber-50 border-amber-400, text-amber-500'
    }
    return (
        <div
            className={styles.base + ' ' + styles[variant]}
            role={variant === 'error' ? 'alert' : ''}
        >{children}</div>
    )
}