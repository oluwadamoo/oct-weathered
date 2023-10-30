
interface ButtonProps {
    onClick?: (val?: any) => void;
    label?: string;
}
function Button({ onClick, label }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className='btn btn-red'>
            {label ? label : 'Remove'}
        </button>
    )
}

export default Button