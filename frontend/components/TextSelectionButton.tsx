import { useState } from "react";

export default function TextSelectionButton({ focused, textTitle, textContent, onClick, disabled }: { focused: boolean, textTitle: string, textContent: string, onClick: () => void, disabled: boolean}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className="p-4 rounded-xl bg-gray-200 text-start mb-3 w-full"
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick()}
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
    );
}