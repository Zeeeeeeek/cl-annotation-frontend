import { Stack, Typography } from "@mui/material"
import { ModifiedIcon, SentIcon } from "./StatusIcons.tsx"

const LEGEND = [
    { icon: <ModifiedIcon />, label: "modified" },
    { icon: <SentIcon />, label: "sent" },
]

export function PaginationLegend() {
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            {LEGEND.map(({ icon, label }) => (
                <Stack key={label} direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    {icon}
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    )
}
