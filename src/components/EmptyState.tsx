import { Box, Typography } from "@mui/material"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"

interface EmptyStateProps {
    message: string
    withIcon?: boolean
}

export function EmptyState({ message, withIcon = true }: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "6.25rem",
                color: "text.secondary",
            }}
        >
            {withIcon && <SentimentVeryDissatisfiedIcon sx={{ fontSize: "2rem", mb: 0.5 }} />}
            <Typography variant="body2">{message}</Typography>
        </Box>
    )
}
