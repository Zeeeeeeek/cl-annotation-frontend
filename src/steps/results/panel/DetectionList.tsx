import { Box, Chip } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import type { Detection } from "../../../types"
import { PanelSection } from "../../../components/PanelSection"
import { EmptyState } from "../../../components/EmptyState"
import { formatDetectionLabel } from "../../../utils/format"
import {filterByThreshold, getDetectionIndexes} from "../../../utils/detections"
import PushPinIcon from "@mui/icons-material/PushPin"

interface DetectionListProps {
    detections: Detection[]
    confidenceThreshold: number
    onToggleVisibility: (detection: Detection) => void
    onToggleHighlight: (detection: Detection) => void
    onDetectionHover: (detectionId: string | null) => void
}

export function DetectionList({
    detections,
    confidenceThreshold,
    onToggleVisibility,
    onToggleHighlight,
    onDetectionHover,
}: DetectionListProps) {
    const detectionsAboveThreshold = filterByThreshold(detections, confidenceThreshold)
    const detectionIndexes = getDetectionIndexes(detections)

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
                            label={formatDetectionLabel(detection, detectionIndexes.get(detection.id) ?? 0)}
                            icon={detection.highlighted ? <PushPinIcon /> : undefined}
                            variant={detection.visible ? "filled" : "outlined"}
                            onClick={() => onToggleHighlight(detection)}
                            onMouseEnter={() => onDetectionHover(detection.id)}
                            onMouseLeave={() => onDetectionHover(null)}
                            deleteIcon={detection.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            onDelete={() => onToggleVisibility(detection)}
                        />
                    ))}
                </Box>
            )}
        </PanelSection>
    )
}
