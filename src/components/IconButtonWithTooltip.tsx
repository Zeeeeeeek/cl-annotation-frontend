import type { ReactNode } from "react"
import { IconButton, Tooltip } from "@mui/material"

interface IconButtonWithTooltipProps {
    title: string
    onClick: () => void
    isDisabled?: boolean
    size?: "small" | "medium"
    children: ReactNode
}

export function IconButtonWithTooltip({
    title,
    onClick,
    isDisabled = false,
    size,
    children,
}: IconButtonWithTooltipProps) {
    // The span lets the tooltip show up even when the button is disabled
    return (
        <Tooltip title={title}>
            <span>
                <IconButton size={size} onClick={onClick} disabled={isDisabled} aria-label={title}>
                    {children}
                </IconButton>
            </span>
        </Tooltip>
    )
}
