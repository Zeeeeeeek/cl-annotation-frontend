import { Box, Stack, Typography } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export function PaginationLegend() {
    return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                <Box sx={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", bgcolor: "warning.main" }} />
                <Typography variant="caption" color="text.secondary">
                    modified
                </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                <CheckCircleIcon color="success" sx={{ fontSize: "0.875rem" }} />
                <Typography variant="caption" color="text.secondary">
                    sent
                </Typography>
            </Stack>
        </Stack>
    )
}
