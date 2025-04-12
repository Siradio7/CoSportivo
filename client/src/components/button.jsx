const Button = ({ label, onClick }) => {
    return (
        <button onClick={onClick} className="bg-cyan-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-600 transition duration-300">
            {label}
        </button>
    )
}

export default Button