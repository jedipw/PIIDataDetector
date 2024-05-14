import { useState } from "react";
import Image from "next/image";

export default function TextSelectionButton({ focused, textTitle, textContent, onClick, onDeleteClick, disabled }: { focused: boolean, textTitle: string, textContent: string, onClick: () => void, onDeleteClick: () => void, disabled: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeletedHovered, setIsDeletedHovered] = useState(false);

    return (
        <div className="relative inline-block w-full">
            <button
                className="p-4 rounded-xl bg-gray-200 text-start mb-3 w-full"
                disabled={disabled}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                style={{
                    backgroundColor: isHovered ? focused ? '#E8A300' : "#EBEBEB" : focused ? '#FAD06D' : "#F4F4F4",
                    cursor: disabled ? 'not-allowed' : '',
                }}
            >
                <div className="truncate text-black font-bold w-44">
                    {textTitle ? textTitle : "Untitled Document"}
                </div>
                <div className="truncate text-black w-44">
                    {textContent ? textContent : "No content"}
                </div>
            </button>
            {(isHovered || isDeletedHovered || focused) && <button
                className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-r-xl"
                style={{
                    width: '39px',
                    height: '80px',
                    backgroundColor: isDeletedHovered ? "#b91c1c" : "#ef4444",
                    cursor: disabled ? 'not-allowed' : '',
                }}
                onClick={onDeleteClick}
                onMouseEnter={() => setIsDeletedHovered(true)}
                onMouseLeave={() => setIsDeletedHovered(false)}
                aria-label="Delete"
                disabled={disabled}
            >
                <Image width="20" height="20" src="/delete.svg" alt="Log out" style={{ filter: 'invert(0%)' }} />
            </button>}
        </div>

    );
}