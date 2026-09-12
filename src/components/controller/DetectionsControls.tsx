import {Box, Chip, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import type {DetectedBox} from "../../api/detectionApi.ts";

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

    return (
        <Box sx={{maxHeight: 150, overflowY: 'auto'}}>
            <Typography gutterBottom>Detections</Typography>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                {detections
                    .map((detection, originalIndex) => ({detection, originalIndex}))
                    .filter(({detection}) => detection.confidence >= confidenceThreshold)
                    .map(({detection, originalIndex}) => (
                        <Chip
                            key={originalIndex}
                            label={`${labelCapitalizeFirstLetter(detection.label)} ${Math.trunc(detection.confidence * 100)}%`}
                            onClick={() => onToggleVisibility(originalIndex)}
                            icon={visibilityStates[originalIndex] ? <VisibilityIcon/> :
                                <VisibilityOffIcon/>}
                            variant={visibilityStates[originalIndex] ? "filled" : "outlined"}
                        />
                    ))
                }
            </Box>
        </Box>
    );
}