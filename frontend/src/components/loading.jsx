import React from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
    return (
        <div className="w-full flex items-center justify-center py-2">
            <faSpinner className= 'animate-spin text-violet-600 size-28' />

        </div>
    )
}
export default Loading