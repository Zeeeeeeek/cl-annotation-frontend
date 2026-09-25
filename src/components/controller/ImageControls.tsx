import {Grid, Input, Pagination, Slider, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from '@mui/icons-material/Replay';
import type {ChangeEvent} from "react";
import {SectionTitle} from "../SectionTitle.tsx";

interface ImageControlsProps {
    confidenceThreshold: number;
    onConfidenceThresholdChange: (event: Event, newValue: number | number[]) => void;
    onConfidenceInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onConfidenceThresholdCommit: (value: number) => void;
    totalResults: number;
    currentIndex: number;
    onIndexChange: (event: ChangeEvent<unknown>, page: number) => void;
    onEditClick: () => void;
    detectionScores?: number[];
}

export default function ImageControls({
                                          confidenceThreshold,
                                          onConfidenceThresholdChange,
                                          onConfidenceInputChange,
                                          onConfidenceThresholdCommit,
                                          totalResults,
                                          currentIndex,
                                          onIndexChange,
                                          onEditClick,
                                          detectionScores
                                      }: ImageControlsProps) {

    const marks = Array.from(
        new Set(
            detectionScores?.map((score) => Math.round(score * 100) / 100)
        )
    ).map((value) => ({ value }));

    function handleBlur() {
        if (confidenceThreshold < 0.5) {
            onConfidenceThresholdCommit(0.5);
        } else if (confidenceThreshold > 1) {
            onConfidenceThresholdCommit(1);
        }
    }

    return (
        <Stack spacing={1}>
            <Box>
                <SectionTitle title={"Confidence Threshold"} tooltip={"Hide detections below this confidence score"} />
                <Grid container spacing={2} sx={{alignItems: 'center'}}>
                    <Grid size="grow">
                        <Slider
                            value={confidenceThreshold}
                            onChange={onConfidenceThresholdChange}
                            step={0.01}
                            min={0.5}
                            max={1}
                            marks={marks}
                            aria-labelledby="confidence-slider"
                            sx={{
                                '& .MuiSlider-mark': {
                                    width: 5,
                                    height: 15,

                                    backgroundColor: 'rgba(0, 0, 0)',
                                },
                                '& .MuiSlider-markActive': {
                                    backgroundColor: 'primary.main',
                                    opacity: 1,
                                }
                            }}
                        />
                    </Grid>
                    <Grid>
                        <Input
                            value={Math.round(confidenceThreshold * 100)}
                            size="small"
                            onChange={onConfidenceInputChange}
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
                onChange={onIndexChange}
                sx={{display: 'flex', justifyContent: 'center'}}
            />
            <Stack direction="row" spacing={1}>
                <Button variant={"contained"} fullWidth startIcon={<ReplayIcon/>} color="error"
                        onClick={() => window.location.reload()}>Start over</Button>
                <Button variant={"contained"} fullWidth startIcon={<EditIcon/>} onClick={onEditClick}>
                    Edit
                </Button>
            </Stack>
        </Stack>
    );
}