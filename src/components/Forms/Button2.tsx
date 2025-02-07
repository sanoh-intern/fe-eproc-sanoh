interface ButtonProps {
    children: React.ReactNode
    className?: string
    variant?: "primary" | "secondary" | "outline"
    as?: React.ElementType
    [x: string]: any
}

const Button2: React.FC<ButtonProps> = ({
    children,
    className = "",
    variant = "primary",
    as: Component = "button",
    ...rest
    }) => {
    const baseStyles = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
    const variants = {
        primary: "bg-primary text-white hover:bg-secondary focus:ring-2 focus:ring-primary/50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    }

    return (
        <Component className={`${baseStyles} ${variants[variant]} ${className}`} {...rest}>
        {children}
        </Component>
    )
}

export default Button2;