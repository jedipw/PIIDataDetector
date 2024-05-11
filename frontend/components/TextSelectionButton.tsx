import { useState } from "react";

export default function TextSelectionFunction() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className="p-4 rounded-xl bg-gray-200 text-start mb-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ backgroundColor: isHovered ? "#EBEBEB" : "#F4F4F4" }}
        >
            <p className="text-black font-bold">Topic</p>
            <p className="text-black">Description Description Description Description</p>
        </button>
    );
}