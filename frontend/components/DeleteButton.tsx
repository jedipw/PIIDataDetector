import { useState } from "react";
import Image from "next/image";

export default function DeleteButton({ onClick, disabled }: { onClick: () => void, disabled: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={() => onClick()}
            className="absolute left-56 bg-red-600 rounded-r-xl flex items-center justify-center"
            style={{
                width: '39px',
                height: '80px',
                backgroundColor: isHovered ? "#b91c1c" : "#ef4444",
                cursor: disabled ? 'not-allowed' : '',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled}
        >
            <Image width="20" height="20" src="/delete.svg" alt="Log out" style={{ filter: 'invert(0%)' }} />
        </button>
    );
}