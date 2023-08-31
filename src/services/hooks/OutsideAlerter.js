import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, handle) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            // don't handle if clicked on direct parent (which is responsible to create this element)
            if (ref.current && !ref.current.parentElement.contains(event.target)) {
                // alert("You clicked outside of me!");
                handle();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, handle]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.handle);

    return <div ref={wrapperRef}>{props.children}</div>;
}