import {Box, Card, CardContent, Grid, Stack, Typography, Slider, Pagination} from "@mui/material";
import MuiInput from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import type { ChangeEvent } from "react";
import EditIcon from '@mui/icons-material/Edit';

const Input = styled(MuiInput)`
    width: 60px;
`;

interface VisualizerControllerProps {
    confidenceThreshold: number;
    onConfidenceThresholdChange: (value: number) => void;
    currentIndex: number;
    totalResults: number;
    onIndexChange: (index: number) => void;
}

export function VisualizerController({
                                         confidenceThreshold,
                                         onConfidenceThresholdChange,
                                         currentIndex,
                                         totalResults,
                                         onIndexChange
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

    return (
            <Card elevation={12}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }} aria-label={"controls"}>
                            <Stack spacing={1}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography id="confidence-slider" gutterBottom>
                                        Confidence Threshold
                                    </Typography>
                                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
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
                                    sx={{ display: 'flex', justifyContent: 'center' }}
                                />
                                <Button variant={"contained"} fullWidth startIcon={<EditIcon />}
                                        onClick={() => console.log("Edit button clicked")}>
                                    Edit
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}  aria-label={"boxes-list"} spacing={2}>
                            <Box>
                                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
    );
}