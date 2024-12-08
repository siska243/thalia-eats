import React from "react";

export default function Spinner() {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-4 border-t-transparent border-primaryColor rounded-full animate-spin"></div>
        </div>
    );
}