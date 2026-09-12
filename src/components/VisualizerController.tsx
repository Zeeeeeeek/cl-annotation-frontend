import {
    Box,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Slider,
    Pagination,
    Chip
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiInput from "@mui/material/Input";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import type {ChangeEvent} from "react";
import EditIcon from '@mui/icons-material/Edit';
import type {DetectedBox} from "../api/detectionApi.ts";

const Input = styled(MuiInput)`
    width: 60px;
`;

interface VisualizerControllerProps {
    confidenceThreshold: number;
    onConfidenceThresholdChange: (value: number) => void;
    currentIndex: number;
    totalResults: number;
    onIndexChange: (index: number) => void;
    detections: DetectedBox[];
    onToggleVisibility: (boxIndex: number) => void;
    colorForLabel: (label: string) => string;
    setColorForLabel: (label: string, color: string) => void;
    visibilityStates: Record<number, boolean>;
}

export function VisualizerController({
                                         confidenceThreshold,
                                         onConfidenceThresholdChange,
                                         currentIndex,
                                         totalResults,
                                         onIndexChange,
                                         detections,
                                         onToggleVisibility,
                                         colorForLabel,
                                         setColorForLabel,
                                         visibilityStates
                                     }: VisualizerControllerProps) {

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        onConfidenceThresholdChange(newValue as number);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const percent = event.target.value === '' ? 0 : Number(event.target.value);
        onConfidenceThresholdChange(percent / 100);
    };

    const handleBlur = () => {
        if (confidenceThreshold < 0.5) {
            onConfidenceThresholdChange(0.5);
        } else if (confidenceThreshold > 1) {
            onConfidenceThresholdChange(1);
        }
    };

    const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
        onIndexChange(page - 1);
    };

    function labelCapitalizeFirstLetter(label: string): string {
        if (!label) return label;
        return label.charAt(0).toUpperCase() + label.slice(1);
    }

    return (
        <Card elevation={12}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 4}}>
                        <Stack spacing={1}>
                            <Box>
                                <Typography id="confidence-slider" gutterBottom>
                                    Confidence Threshold
                                </Typography>
                                <Grid container spacing={2} sx={{alignItems: 'center'}}>
                                    <Grid size="grow">
                                        <Slider
                                            value={confidenceThreshold}
                                            onChange={handleSliderChange}
                                            step={0.01}
                                            min={0.5}
                                            max={1}
                                            aria-labelledby="confidence-slider"
                                        />
                                    </Grid>
                                    <Grid>
                                        <Input
                                            value={Math.round(confidenceThreshold * 100)}
                                            size="small"
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            inputProps={{
                                                step: 1,
                                                min: 50,
                                                max: 100,
                                                type: 'number',
                                                'aria-labelledby': 'confidence-slider',
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Pagination
                                count={totalResults}
                                page={currentIndex + 1}
                                onChange={handlePageChange}
                                sx={{display: 'flex', justifyContent: 'center'}}
                            />
                            <Button variant={"contained"} fullWidth startIcon={<EditIcon/>}
                                    onClick={() => alert("Not implemented yet")}>
                                Edit
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid size={{xs: 12, sm: 4}}>
                        <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                            <Typography gutterBottom>Detections</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {detections
                                    .map((detection, originalIndex) => ({detection, originalIndex}))
                                    .filter(({detection}) => detection.confidence >= confidenceThreshold)
                                    .map(({detection, originalIndex}) => (
                                        <Chip
                                            key={originalIndex}
                                            label={`${labelCapitalizeFirstLetter(detection.label)} ${Math.trunc(detection.confidence * 100)}%`}
                                            onClick={() => onToggleVisibility(originalIndex)}
                                            icon={visibilityStates[originalIndex] ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                            variant={visibilityStates[originalIndex] ? "filled" : "outlined"}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{xs: 12, sm: 4}} aria-label={"color-picker"} spacing={2}>
                        <Box>Color picker</Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}