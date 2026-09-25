import { Box } from "@mui/material"
import type { ReactNode } from "react"
import { SectionTitle } from "./SectionTitle"

interface PanelSectionProps {
    title: string
    tooltip: string
    children: ReactNode
}

export function PanelSection({ title, tooltip, children }: PanelSectionProps) {
    return (
        <Box sx={{ maxHeight: 150, display: "flex", flexDirection: "column" }}>
            <SectionTitle title={title} tooltip={tooltip} />
            <Box sx={{ overflowY: "auto", flexGrow: 1, pb: 1 }}>{children}</Box>
        </Box>
    )
}