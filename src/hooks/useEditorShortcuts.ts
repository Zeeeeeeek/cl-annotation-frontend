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

const MODE_SHORTCUTS: Partial<Record<string, EditMode>> = { v: "Select", b: "Draw", h: "Pan" }

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

        const mode = MODE_SHORTCUTS[key]
        if (mode) {
            event.preventDefault()
            onModeChange(mode)
            return
        }

        if ((key === "delete" || key === "backspace") && selectedId) {
            event.preventDefault()
            onDelete(selectedId)
        }
    })

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])
}
