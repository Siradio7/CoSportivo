const getButtonStyles = (variant) => {
    switch (variant) {
        case "secondary":
            return "bg-gray-500 hover:bg-gray-600";
        case "danger":
            return "bg-red-500 hover:bg-red-600";
        case "success":
            return "bg-green-500 hover:bg-green-600";
        default:
            return "bg-cyan-500 hover:bg-cyan-600";
    }
};

const Button = ({ 
    children, 
    onClick = () => {}, 
    disabled = false, 
    className = "", 
    icon = null,
    variant = "primary" 
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-36 text-sm flex items-center justify-center text-white px-4 py-2 rounded-md cursor-pointer transition duration-300
                ${getButtonStyles(variant)} 
                disabled:opacity-50 disabled:cursor-not-allowed 
                ${className}`}
        >
            {icon && <span className="mr-1">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;