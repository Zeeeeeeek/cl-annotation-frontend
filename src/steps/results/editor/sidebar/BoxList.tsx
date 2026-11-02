import { Box, List, Stack, Typography } from "@mui/material"
import type { Detection } from "../../../../types.ts"
import { formatDetectionName } from "../../../../utils/format.ts"
import { getDetectionIndexes } from "../../../../utils/detections.ts"
import { BoxListItem } from "./BoxListItem.tsx"

interface BoxListProps {
    detections: Detection[]
    selectedId: string | null
    onSelect: (id: string) => void
    onToggleVisibility: (id: string) => void
    onDelete: (id: string) => void
    colorForLabel: (label: string) => string
}

export function BoxList({
    detections,
    selectedId,
    onSelect,
    onToggleVisibility,
    onDelete,
    colorForLabel,
}: BoxListProps) {
    const detectionsIndexes = getDetectionIndexes(detections)

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
                <Typography variant="subtitle1">Boxes</Typography>
                <Typography variant="body2" color="text.secondary">
                    {detections.length}
                </Typography>
            </Stack>
            <Box sx={{ flex: "0 1 auto", minHeight: 0, overflowY: "auto" }}>
                <List>
                    {detections.map((detection) => (
                        <BoxListItem
                            key={detection.id}
                            detection={detection}
                            name={formatDetectionName(detection, detectionsIndexes.get(detection.id) ?? 0)}
                            color={colorForLabel(detection.label)}
                            isSelected={detection.id === selectedId}
                            onSelect={onSelect}
                            onToggleVisibility={onToggleVisibility}
                            onDelete={onDelete}
                        />
                    ))}
                </List>
            </Box>
        </Box>
    )
}
