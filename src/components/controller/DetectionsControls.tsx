import { Box, Chip } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import type { DetectedBox } from "../../types"
import { PanelSection } from "../PanelSection"
import { EmptyState } from "../EmptyState"
import { capitalizeFirstLetter, formatConfidence } from "../../utils/format"

interface DetectionsControlsProps {
    detections: DetectedBox[];
    confidenceThreshold: number;
    onToggleVisibility: (boxIndex: number) => void;
    visibilityStates: Record<number, boolean>;
}

export function DetectionsControls({ detections, confidenceThreshold, onToggleVisibility, visibilityStates }: DetectionsControlsProps) {
    const filteredDetections = detections
        .map((detection, originalIndex) => ({ detection, originalIndex }))
        .filter(({ detection }) => detection.confidence >= confidenceThreshold)

    return (
        <PanelSection title="Detection Boxes" tooltip="Hide or show the boxes above the confidence threshold">
            {detections.length === 0 && <EmptyState message="No detections" />}

            {detections.length > 0 && filteredDetections.length === 0 && (
                <EmptyState message="Try to lower the threshold" withIcon={false} />
            )}

            {filteredDetections.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {filteredDetections.map(({ detection, originalIndex }) => (
                        <Chip
                            key={originalIndex}
                            label={`${capitalizeFirstLetter(detection.label)} ${formatConfidence(detection.confidence)}`}
                            deleteIcon={visibilityStates[originalIndex] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            onDelete={() => onToggleVisibility(originalIndex)}
                            variant={visibilityStates[originalIndex] ? "filled" : "outlined"}
                        />
                    ))}
                </Box>
            )}
        </PanelSection>
    )
}