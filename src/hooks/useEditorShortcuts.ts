import { useEffect, useEffectEvent } from "react"
import type { EditMode } from "../types.ts"

interface EditorShortcutsOptions {
    isEnabled: boolean
    selectedId: string | null
    onModeChange: (mode: EditMode) => void
    onDelete: (id: string) => void
    onUndo: () => void
    onRedo: () => void
}

export function useEditorShortcuts({
    isEnabled,
    selectedId,
    onModeChange,
    onDelete,
    onUndo,
    onRedo,
}: EditorShortcutsOptions) {
    const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
        if (!isEnabled) return
        if ((event.target as HTMLElement).closest("input, textarea")) return
        const key = event.key.toLowerCase()

        if ((event.ctrlKey || event.metaKey) && key === "z") {
            event.preventDefault()
            if (event.shiftKey) {
                onRedo()
            } else {
                onUndo()
            }
            return
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return
        }

        switch (key) {
            case "v":
                onModeChange("Select")
                event.preventDefault()
                break
            case "b":
                onModeChange("Draw")
                event.preventDefault()
                break
            case "h":
                onModeChange("Pan")
                event.preventDefault()
                break
            case "delete":
            case "backspace":
                if (selectedId) {
                    onDelete(selectedId)
                    event.preventDefault()
                }
                break
            default:
                break
        }
    })

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])
}
