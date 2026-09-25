import { Tooltip, Typography } from "@mui/material"

interface SectionTitleProps {
    title: string
    tooltip: string
}

export function SectionTitle({ title, tooltip }: SectionTitleProps) {
    return (
        <Typography gutterBottom>
            <Tooltip title={tooltip} arrow>
                <span>{title}</span>
            </Tooltip>
        </Typography>
    )
}
