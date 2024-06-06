import React, { useEffect, useRef, useState } from 'react'

const useClicksOutside = () => {

/**Listens for user click on burger menu, to check 
 * if it has expanded
 */
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setExpanded(false)
            }
        }
        document.addEventListener('mouseup', handleClickOutside)
        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [ref])
    return {expanded, setExpanded, ref}
}

export default useClicksOutside