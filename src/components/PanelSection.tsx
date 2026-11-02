import { Box, Stack } from "@mui/material"
import type { ReactNode } from "react"
import { SectionTitle } from "./SectionTitle"

interface PanelSectionProps {
    title: string
    tooltip: string
    children: ReactNode
}

export function PanelSection({ title, tooltip, children }: PanelSectionProps) {
    return (
        <Stack sx={{ maxHeight: "9.375rem" }}>
            <SectionTitle title={title} tooltip={tooltip} />
            <Box sx={{ overflowY: "auto", flexGrow: 1, pb: 1 }}>{children}</Box>
        </Stack>
    )
}
