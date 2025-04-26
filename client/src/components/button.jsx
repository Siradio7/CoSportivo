const getButtonStyles = (variant) => {
    switch (variant) {
        case "secondary":
            return "bg-gray-500 hover:bg-gray-600 shadow-gray-300/40";
        case "danger":
            return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-300/40";
        case "success":
            return "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-300/40";
        case "outline":
            return "bg-white border border-cyan-500 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-600 shadow-cyan-100/40";
        case "ghost":
            return "bg-transparent text-gray-700 hover:bg-gray-100 shadow-none";
        default:
            return "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-300/40";
    }
};

const getSizeStyles = (size) => {
    switch (size) {
        case "sm":
            return "text-xs px-3 py-1.5 rounded-lg";
        case "lg":
            return "text-base px-6 py-3 rounded-xl";
        case "xl":
            return "text-lg px-8 py-4 rounded-xl";
        default: // md
            return "text-sm px-4 py-2 rounded-xl";
    }
};

const Button = ({ 
    children, 
    onClick = () => {}, 
    disabled = false, 
    className = "", 
    icon = null,
    variant = "primary",
    size = "md",
    fullWidth = false
}) => {
    const variantStyles = getButtonStyles(variant);
    const sizeStyles = getSizeStyles(size);
    const isOutlineOrGhost = variant === "outline" || variant === "ghost";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                font-medium flex items-center justify-center
                transition-all duration-300 ease-in-out 
                ${variantStyles} 
                ${sizeStyles}
                ${fullWidth ? 'w-full' : ''} 
                ${isOutlineOrGhost ? '' : 'text-white'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'}
                ${className}
            `}
        >
            {icon && <span className={`${children ? 'mr-2' : ''}`}>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;