import { Box } from "@mui/material"
import type { ReactNode } from "react"

interface KbdProps {
    children: ReactNode
}

export function Kbd({ children }: KbdProps) {
    return (
        <Box
            component="kbd"
            sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                backgroundColor: "background.paper",
                border: 1,
                borderColor: "divider",
                color: "text.primary",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 500,
                lineHeight: 1.4,
            }}
        >
            {children}
        </Box>
    )
}
