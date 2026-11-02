import { Button, Divider, Grid, Paper, Stack } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import ReplayIcon from "@mui/icons-material/Replay"
import type { Detection } from "../../../types"
import { ThresholdControl } from "./ThresholdControl"
import { DetectionList } from "./DetectionList"
import { LabelColors } from "./LabelColors"
import { filterByThreshold } from "../../../utils/detections.ts"
import { ImagePagination } from "./ImagePagination.tsx"

interface ControlPanelProps {
    confidenceThreshold: number
    onConfidenceThresholdChange: (value: number) => void
    currentIndex: number
    totalResults: number
    onIndexChange: (index: number) => void
    detections: Detection[]
    onToggleVisibility: (detection: Detection) => void
    colorForLabel: (label: string) => string
    setColorForLabel: (label: string, color: string) => void
    onReset: () => void
    onToggleHighlight: (detection: Detection) => void
    onDetectionHover: (detectionId: string | null) => void
    onImageEdit: () => void
    editedImages: boolean[]
    sentImages: boolean[]
}

function SectionDivider() {
    return (
        <>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
            <Divider orientation="horizontal" sx={{ display: { xs: "block", sm: "none" }, width: "100%" }} />
        </>
    )
}

export function ControlPanel({
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
    onToggleHighlight,
    onDetectionHover,
    onImageEdit,
    editedImages,
    sentImages,
}: ControlPanelProps) {
    const uniqueLabels = [
        ...new Set(filterByThreshold(detections, confidenceThreshold).map((detection) => detection.label)),
    ]

    return (
        <Paper elevation={12} sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: "grow" }} sx={{ order: { xs: 5, sm: 1 } }}>
                    <Stack spacing={1}>
                        <ThresholdControl
                            value={confidenceThreshold}
                            onChange={onConfidenceThresholdChange}
                            scores={detections.map((detection) => detection.confidence)}
                        />
                        <ImagePagination
                            currentIndex={currentIndex}
                            totalResults={totalResults}
                            onIndexChange={onIndexChange}
                            editedImages={editedImages}
                            sentImages={sentImages}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                fullWidth
                                color="error"
                                startIcon={<ReplayIcon />}
                                onClick={onReset}
                            >
                                Start over
                            </Button>
                            <Button variant="contained" fullWidth startIcon={<EditIcon />} onClick={onImageEdit}>
                                Edit
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: "auto" }}
                    sx={{ display: "flex", justifyContent: "center", order: { xs: 2, sm: 2 } }}
                >
                    <SectionDivider />
                </Grid>

                <Grid size={{ xs: 12, sm: "grow" }} sx={{ order: { xs: 1, sm: 3 } }}>
                    <DetectionList
                        detections={detections}
                        confidenceThreshold={confidenceThreshold}
                        onToggleVisibility={onToggleVisibility}
                        onToggleHighlight={onToggleHighlight}
                        onDetectionHover={onDetectionHover}
                    />
                </Grid>

                <Grid
                    size={{ xs: 12, sm: "auto" }}
                    sx={{ display: "flex", justifyContent: "center", order: { xs: 4, sm: 4 } }}
                >
                    <SectionDivider />
                </Grid>

                <Grid size={{ xs: 12, sm: "grow" }} sx={{ order: { xs: 3, sm: 5 } }}>
                    <LabelColors
                        labels={uniqueLabels}
                        colorForLabel={colorForLabel}
                        setColorForLabel={setColorForLabel}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}
