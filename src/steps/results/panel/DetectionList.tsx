import { Box, Chip } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import type { Detection } from "../../../types.ts"
import { PanelSection } from "../../../components/PanelSection.tsx"
import { EmptyState } from "../../../components/EmptyState.tsx"
import { capitalizeFirstLetter, formatConfidence } from "../../../utils/format.ts"
import { filterByThreshold } from "../../../utils/detections.ts"

interface DetectionsControlsProps {
    detections: Detection[]
    confidenceThreshold: number
    onToggleVisibility: (detectionId: string) => void
}

export function DetectionList({ detections, confidenceThreshold, onToggleVisibility }: DetectionsControlsProps) {
    const detectionsAboveThreshold = filterByThreshold(detections, confidenceThreshold)

    return (
        <PanelSection title="Detection Boxes" tooltip="Hide or show the boxes above the confidence threshold">
            {detections.length === 0 && <EmptyState message="No detections" />}

            {detections.length > 0 && detectionsAboveThreshold.length === 0 && (
                <EmptyState message="Try to lower the threshold" withIcon={false} />
            )}

            {detectionsAboveThreshold.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {detectionsAboveThreshold.map(detection => (
                        <Chip
                            key={detection.id}
                            label={`${capitalizeFirstLetter(detection.label)} ${formatConfidence(detection.confidence)}`}
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