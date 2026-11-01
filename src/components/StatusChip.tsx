import { Chip, type ChipProps } from "@mui/material"
import type { ImageStatus, SendStatus } from "../types"
import { capitalizeFirstLetter } from "../utils/format"

const STATUS_COLORS: Record<ImageStatus | SendStatus, ChipProps["color"]> = {
    queued: "default",
    processing: "primary",
    completed: "success",
    error: "error",
    sending: "primary",
    sent: "success",
}

interface StatusChipProps {
    status: ImageStatus | SendStatus
}

export function StatusChip({ status }: StatusChipProps) {
    return <Chip color={STATUS_COLORS[status]} label={capitalizeFirstLetter(status)} />
}
