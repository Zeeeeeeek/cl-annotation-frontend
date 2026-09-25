import { Chip, type ChipProps } from "@mui/material"
import type { ImageStatus } from "../types"
import { capitalizeFirstLetter } from "../utils/format"

const STATUS_COLORS: Record<ImageStatus, ChipProps["color"]> = {
    queued: "default",
    processing: "primary",
    completed: "success",
    error: "error",
}

interface StatusChipProps {
    status: ImageStatus
}

export function StatusChip({ status }: StatusChipProps) {
    return <Chip color={STATUS_COLORS[status]} label={capitalizeFirstLetter(status)} />
}