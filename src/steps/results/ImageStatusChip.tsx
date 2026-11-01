import { Chip } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CircleIcon from "@mui/icons-material/Circle"

interface ImageStatusChipProps {
    edited: boolean
    sent: boolean
}

export function ImageStatusChip({ edited, sent }: ImageStatusChipProps) {
    if (sent) {
        return <Chip icon={<CheckCircleIcon />} label="Sent" color="success" size="small" />
    }
    if (edited) {
        return <Chip icon={<CircleIcon />} label="Modified · not sent yet" color="warning" size="small" />
    }
    return null
}
