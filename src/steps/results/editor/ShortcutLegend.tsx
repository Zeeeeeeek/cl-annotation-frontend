import { Box, Typography } from "@mui/material"
import { Kbd } from "../../../components/Kbd.tsx"

const SHORTCUTS = [
    { key: "Del", label: "delete" },
    { key: "Esc", label: "deselect" },
    { key: "V", label: "select" },
    { key: "B", label: "draw" },
]

export function ShortcutLegend() {
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 2, rowGap: 0.5, justifyContent: "space-around" }}>
            {SHORTCUTS.map(({ key, label }) => (
                <Box key={key} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Kbd>{key}</Kbd>
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}
