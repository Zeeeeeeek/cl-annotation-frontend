import type { ImageStatus, SendStatus } from "../types.ts"
import { ListItem, ListItemText } from "@mui/material"
import { StatusChip } from "./StatusChip.tsx"
import { stripExtension } from "../utils/format.ts"

interface ImageStatusItemProps {
    fileName: string
    status: ImageStatus | SendStatus
    errorMessage?: string
    hasDivider: boolean
}

export function ImageStatusItem({ fileName, status, errorMessage, hasDivider }: ImageStatusItemProps) {
    return (
        <ListItem divider={hasDivider}>
            <ListItemText
                primary={stripExtension(fileName)}
                secondary={errorMessage}
                slotProps={{ secondary: { color: "error" } }}
            />
            <StatusChip status={status} />
        </ListItem>
    )
}
