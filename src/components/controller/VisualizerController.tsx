import {
    Box,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import type {ChangeEvent} from "react";
import type {DetectedBox} from "../../api/detectionApi.ts";
import ImageControls from "./ImageControls.tsx";
import {DetectionsControls} from "./DetectionsControls.tsx";


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

    const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
        onIndexChange(page - 1);
    };


    return (
        <Card elevation={12}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 4}}>
                        <ImageControls
                            confidenceThreshold={confidenceThreshold}
                            onConfidenceThresholdChange={handleSliderChange}
                            onConfidenceInputChange={handleInputChange}
                            onConfidenceThresholdCommit={onConfidenceThresholdChange}
                            totalResults={totalResults}
                            currentIndex={currentIndex}
                            onIndexChange={handlePageChange}
                            onEditClick={() => alert("Not implemented yet")}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 4}}>
                        <DetectionsControls
                            detections={detections}
                            confidenceThreshold={confidenceThreshold}
                            onToggleVisibility={onToggleVisibility}
                            visibilityStates={visibilityStates}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 4}} aria-label={"color-picker"} spacing={2}>
                        <Box>Color picker</Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}