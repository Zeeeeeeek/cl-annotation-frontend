import { Box, Chip } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import type { Detection } from "../../../types"
import { PanelSection } from "../../../components/PanelSection"
import { EmptyState } from "../../../components/EmptyState"
import { formatDetectionLabel } from "../../../utils/format"
import { filterByThreshold } from "../../../utils/detections"

interface DetectionListProps {
    detections: Detection[]
    confidenceThreshold: number
    onToggleVisibility: (detectionId: string) => void
}

export function DetectionList({ detections, confidenceThreshold, onToggleVisibility }: DetectionListProps) {
    const detectionsAboveThreshold = filterByThreshold(detections, confidenceThreshold)

    return (
        <PanelSection title="Detection Boxes" tooltip="Hide or show the boxes above the confidence threshold">
            {detections.length === 0 && <EmptyState message="No detections" />}

            {detections.length > 0 && detectionsAboveThreshold.length === 0 && (
                <EmptyState message="Try to lower the threshold" withIcon={false} />
            )}

            {detectionsAboveThreshold.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {detectionsAboveThreshold.map((detection) => (
                        <Chip
                            key={detection.id}
                            label={formatDetectionLabel(detection)}
                            deleteIcon={detection.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            onDelete={() => onToggleVisibility(detection.id)}
                            variant={detection.visible ? "filled" : "outlined"}
                        />
                    ))}
                </Box>
            )}
        </PanelSection>
    )
}
