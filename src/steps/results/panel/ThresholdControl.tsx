import { Box, Grid, Input, Slider } from "@mui/material"
import type { ChangeEvent } from "react"
import { SectionTitle } from "../../../components/SectionTitle"

const MIN_THRESHOLD = 0.5
const MAX_THRESHOLD = 1

interface ThresholdControlProps {
    value: number
    onChange: (value: number) => void
    scores: number[]
}

export function ThresholdControl({ value, onChange, scores }: ThresholdControlProps) {
    // One mark on the slider for each distinct detection score
    const marks = [...new Set(scores.map(score => Math.round(score * 100) / 100))].map(score => ({ value: score }))

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const percent = event.target.value === "" ? 0 : Number(event.target.value)
        onChange(percent / 100)
    }

    // The input allows out-of-range values while typing: clamp them when it loses focus
    function handleBlur() {
        onChange(Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, value)))
    }

    return (
        <Box>
            <SectionTitle title="Confidence Threshold" tooltip="Hide detections below this confidence score" />
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size="grow">
                    <Slider
                        value={value}
                        onChange={(_, newValue) => onChange(newValue as number)}
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
                        value={Math.round(value * 100)}
                        size="small"
                        onChange={handleInputChange}
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
    )
}