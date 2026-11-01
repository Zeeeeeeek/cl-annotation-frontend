import { ToggleButton, Typography } from "@mui/material"
import { Kbd } from "../../../components/Kbd.tsx"
import type { ReactNode } from "react"
import type { EditMode } from "../../../types.ts"

interface ModeToggleButtonProps {
    value: EditMode
    text: string
    keyboardShortcut: string
    icon: ReactNode
}

export function ModeToggleButton({ value, text, keyboardShortcut, icon }: ModeToggleButtonProps) {
    return (
        <ToggleButton value={value} sx={{ textTransform: "none", gap: 1 }}>
            {icon}
            <Typography variant={"body2"}>{text}</Typography>
            <Kbd>{keyboardShortcut}</Kbd>
        </ToggleButton>
    )
}
