import {Grid, Input, Pagination, Slider, Stack, Tooltip, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from '@mui/icons-material/Replay';
import type {ChangeEvent} from "react";

interface ImageControlsProps {
    confidenceThreshold: number;
    onConfidenceThresholdChange: (event: Event, newValue: number | number[]) => void;
    onConfidenceInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onConfidenceThresholdCommit: (value: number) => void;
    totalResults: number;
    currentIndex: number;
    onIndexChange: (event: ChangeEvent<unknown>, page: number) => void;
    onEditClick: () => void;
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
                                      }: ImageControlsProps) {

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
                <Typography gutterBottom>
                    <Tooltip title="Hide detections below this confidence score" arrow>
                        <span>Confidence Threshold</span>
                    </Tooltip>
                </Typography>
                <Grid container spacing={2} sx={{alignItems: 'center'}}>
                    <Grid size="grow">
                        <Slider
                            value={confidenceThreshold}
                            onChange={onConfidenceThresholdChange}
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