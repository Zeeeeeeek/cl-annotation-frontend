import {Box, Chip, Tooltip, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import type { DetectedBox } from "../../api/detectionApi.ts";

interface DetectionsControlsProps {
    detections: DetectedBox[];
    confidenceThreshold: number;
    onToggleVisibility: (boxIndex: number) => void;
    visibilityStates: Record<number, boolean>;
}

export function DetectionsControls({
                                       detections,
                                       confidenceThreshold,
                                       onToggleVisibility,
                                       visibilityStates
                                   }: DetectionsControlsProps) {

    function labelCapitalizeFirstLetter(label: string): string {
        if (!label) return label;
        return label.charAt(0).toUpperCase() + label.slice(1);
    }

    const filteredDetections = detections
        .map((detection, originalIndex) => ({ detection, originalIndex }))
        .filter(({ detection }) => detection.confidence >= confidenceThreshold);

    return (
        <Box sx={{ maxHeight: 150, display: 'flex', flexDirection: 'column' }}>

            <Typography gutterBottom>
                <Tooltip title="Hide or highlight specific boxes that respect the conficence set" arrow>
                    <span>Detection Boxes</span>
                </Tooltip>
            </Typography>

            <Box sx={{ overflowY: 'auto', flexGrow: 1, pb: 1 }}>

                {detections.length === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, color: 'text.secondary' }}>
                        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 32, mb: 0.5 }} />
                        <Typography variant="body2">No detections</Typography>
                    </Box>
                )}

                {detections.length > 0 && filteredDetections.length === 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, color: 'text.secondary' }}>
                        <Typography variant="body2">Try to lower the threshold</Typography>
                    </Box>
                )}

                {filteredDetections.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {filteredDetections.map(({ detection, originalIndex }) => (
                            <Chip
                                key={originalIndex}
                                label={`${labelCapitalizeFirstLetter(detection.label)} ${Math.trunc(detection.confidence * 100)}%`}
                                deleteIcon={visibilityStates[originalIndex] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                onDelete={() => onToggleVisibility(originalIndex)}
                                variant={visibilityStates[originalIndex] ? "filled" : "outlined"}
                                onClick={() => console.log(`Clicked on detection box ${originalIndex}`)}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}