import { type DragEvent, useRef, useState } from "react"

export function useFileDrop(onFilesDrop: (files: File[]) => void) {
    const [isDragging, setIsDragging] = useState(false)
    const dragCounter = useRef(0)

    function handleDragEnter(event: DragEvent<HTMLElement>) {
        event.preventDefault()
        dragCounter.current++
        setIsDragging(true)
    }

    function handleDragLeave(event: DragEvent<HTMLElement>) {
        event.preventDefault()
        dragCounter.current--
        if (dragCounter.current === 0) {
            setIsDragging(false)
        }
    }

    function handleDragOver(event: DragEvent<HTMLElement>) {
        event.preventDefault()
    }

    function handleDrop(event: DragEvent<HTMLElement>) {
        event.preventDefault()
        dragCounter.current = 0
        setIsDragging(false)
        onFilesDrop(Array.from(event.dataTransfer.files))
    }

    return {
        isDragging,
        dropHandlers: {
            onDragEnter: handleDragEnter,
            onDragLeave: handleDragLeave,
            onDragOver: handleDragOver,
            onDrop: handleDrop,
        },
    }
}
