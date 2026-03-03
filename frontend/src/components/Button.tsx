interface Button {
    name: string;
    onClick: () => void;
    className?: string;
}

export default function Button({ name, className, onClick }: Readonly<Button>) {
    return (
        <button className={className} onClick={onClick}>
            {name}
        </button>
    );
}