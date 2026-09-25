import { Divider, Grid, Paper } from "@mui/material"
import type { ChangeEvent } from "react"
import type { Detection } from "../../types"
import { ImageControls } from "./ImageControls"
import { DetectionsControls } from "./DetectionsControls"
import { ColorPicker } from "./ColorPicker"

interface VisualizerControllerProps {
    confidenceThreshold: number
    onConfidenceThresholdChange: (value: number) => void
    currentIndex: number
    totalResults: number
    onIndexChange: (index: number) => void
    detections: Detection[]
    onToggleVisibility: (detectionId: string) => void
    colorForLabel: (label: string) => string
    setColorForLabel: (label: string, color: string) => void
    onReset: () => void
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
                                         onReset,
                                     }: VisualizerControllerProps) {
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        onConfidenceThresholdChange(newValue as number)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const percent = event.target.value === "" ? 0 : Number(event.target.value)
        onConfidenceThresholdChange(percent / 100)
    }

    const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
        onIndexChange(page - 1)
    }

    const uniqueLabels = [...new Set(detections.map(detection => detection.label))]

    return (
        <Paper elevation={12} sx={{ p: 2, height: "17vh", overflowY: "auto" }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: "grow" }} sx={{ order: { xs: 5, sm: 1 } }}>
                    <ImageControls
                        confidenceThreshold={confidenceThreshold}
                        onConfidenceThresholdChange={handleSliderChange}
                        onConfidenceInputChange={handleInputChange}
                        onConfidenceThresholdCommit={onConfidenceThresholdChange}
                        totalResults={totalResults}
                        currentIndex={currentIndex}
                        onIndexChange={handlePageChange}
                        onEditClick={() => alert("Not implemented yet")}
                        onReset={onReset}
                        detectionScores={detections.map(detection => detection.confidence)}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: "auto" }} sx={{ display: "flex", justifyContent: "center", order: { xs: 2, sm: 2 } }}>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
                    <Divider orientation="horizontal" sx={{ display: { xs: "block", sm: "none" }, width: "100%" }} />
                </Grid>

                <Grid size={{ xs: 12, sm: "grow" }} sx={{ order: { xs: 1, sm: 3 } }}>
                    <DetectionsControls
                        detections={detections}
                        confidenceThreshold={confidenceThreshold}
                        onToggleVisibility={onToggleVisibility}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: "auto" }} sx={{ display: "flex", justifyContent: "center", order: { xs: 4, sm: 4 } }}>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
                    <Divider orientation="horizontal" sx={{ display: { xs: "block", sm: "none" }, width: "100%" }} />
                </Grid>

                <Grid size={{ xs: 12, sm: "grow" }} sx={{ order: { xs: 3, sm: 5 } }}>
                    <ColorPicker labels={uniqueLabels} colorForLabel={colorForLabel} setColorForLabel={setColorForLabel} />
                </Grid>
            </Grid>
        </Paper>
    )
}