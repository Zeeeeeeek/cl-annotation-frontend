import { Chip } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

interface ImageStatusChipProps {
    edited: boolean
    sent: boolean
}

function FiberManualRecordIcon() {
    return null
}

export function ImageStatusChip({ edited, sent }: ImageStatusChipProps) {
    if (sent) {
        return <Chip icon={<CheckCircleIcon />} label="Sent" color="success" size="small" />
    }
    if (edited) {
        return <Chip icon={<FiberManualRecordIcon />} label="Modified · not sent yet" color="warning" size="small" />
    }
    return null
}
