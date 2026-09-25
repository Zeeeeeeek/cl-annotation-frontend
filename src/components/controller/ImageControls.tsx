import { Box, Button, Grid, Input, Pagination, Slider, Stack } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import ReplayIcon from "@mui/icons-material/Replay"
import type { ChangeEvent } from "react"
import { SectionTitle } from "../SectionTitle"

const MIN_THRESHOLD = 0.5
const MAX_THRESHOLD = 1

interface ImageControlsProps {
    confidenceThreshold: number
    onConfidenceThresholdChange: (event: Event, newValue: number | number[]) => void
    onConfidenceInputChange: (event: ChangeEvent<HTMLInputElement>) => void
    onConfidenceThresholdCommit: (value: number) => void
    totalResults: number
    currentIndex: number
    onIndexChange: (event: ChangeEvent<unknown>, page: number) => void
    onEditClick: () => void
    onReset: () => void
    detectionScores: number[]
}

export function ImageControls({
                                  confidenceThreshold,
                                  onConfidenceThresholdChange,
                                  onConfidenceInputChange,
                                  onConfidenceThresholdCommit,
                                  totalResults,
                                  currentIndex,
                                  onIndexChange,
                                  onEditClick,
                                  onReset,
                                  detectionScores,
                              }: ImageControlsProps) {
    // One mark on the slider for each distinct detection score
    const marks = [...new Set(detectionScores.map(score => Math.round(score * 100) / 100))].map(value => ({ value }))

    function handleBlur() {
        if (confidenceThreshold < MIN_THRESHOLD) {
            onConfidenceThresholdCommit(MIN_THRESHOLD)
        } else if (confidenceThreshold > MAX_THRESHOLD) {
            onConfidenceThresholdCommit(MAX_THRESHOLD)
        }
    }

    return (
        <Stack spacing={1}>
            <Box>
                <SectionTitle title="Confidence Threshold" tooltip="Hide detections below this confidence score" />
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid size="grow">
                        <Slider
                            value={confidenceThreshold}
                            onChange={onConfidenceThresholdChange}
                            step={0.01}
                            min={MIN_THRESHOLD}
                            max={MAX_THRESHOLD}
                            marks={marks}
                            aria-label="Confidence threshold"
                            sx={{
                                "& .MuiSlider-mark": { width: 5, height: 15, backgroundColor: "black" },
                                "& .MuiSlider-markActive": { backgroundColor: "primary.main", opacity: 1 },
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
                                min: MIN_THRESHOLD * 100,
                                max: MAX_THRESHOLD * 100,
                                type: "number",
                                "aria-label": "Confidence threshold percentage",
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Pagination
                count={totalResults}
                page={currentIndex + 1}
                onChange={onIndexChange}
                sx={{ display: "flex", justifyContent: "center" }}
            />

            <Stack direction="row" spacing={1}>
                <Button variant="contained" fullWidth startIcon={<ReplayIcon />} color="error" onClick={onReset}>
                    Start over
                </Button>
                <Button variant="contained" fullWidth startIcon={<EditIcon />} onClick={onEditClick}>
                    Edit
                </Button>
            </Stack>
        </Stack>
    )
}