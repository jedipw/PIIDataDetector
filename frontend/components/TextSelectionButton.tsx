import { useState } from "react";

export default function TextSelectionFunction({ focused, textTitle, textContent, onClick }: { focused: boolean, textTitle: string, textContent: string, onClick: () => void }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className="p-4 rounded-xl bg-gray-200 text-start mb-3 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick()}
            style={{ backgroundColor: isHovered ? focused ? '#E8A300' : "#EBEBEB" : focused ? '#FAD06D' : "#F4F4F4" }}
        >
            <div className="truncate text-black font-bold">
                {textTitle ? textTitle : "Untitled Document"}
            </div>
            <div className="truncate text-black w-50">
                {textContent ? textContent : "No content"}
            </div>
        </button>
    );
}