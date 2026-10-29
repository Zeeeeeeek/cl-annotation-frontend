import { Box, Button, Dialog, DialogActions, Divider, Typography } from "@mui/material"
import { useEffect, useEffectEvent, useMemo, useState } from "react"
import type { BoundingBox, Detection, EditMode, ImageItem } from "../../../types"
import { EditHeader } from "./EditHeader.tsx"
import { BoxList } from "./BoxList.tsx"
import { SelectedBoxPanel } from "./SelectedBoxPanel.tsx"
import { ShortcutLegend } from "./ShortcutLegend.tsx"
import { EditCanvas } from "./EditCanvas.tsx"

interface EditDialogProps {
    image: ImageItem
    imageIndex: number
    totalImages: number
    onClose: () => void
    onSave: (updatedDetections: Detection[]) => void
    colorForLabel: (label: string) => string
    labels: string[]
    onAddLabel: (label: string) => void
}

export function EditDialog({
    image,
    imageIndex,
    totalImages,
    onClose,
    onSave,
    colorForLabel,
    labels,
    onAddLabel,
}: EditDialogProps) {
    const [mode, setMode] = useState<EditMode>("Select")
    const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null)

    const [detections, setDetections] = useState<Detection[]>(image.detections)
    const selectedDetection = detections.find((d) => d.id === selectedDetectionId) || null
    const editorLabels = [...new Set([...labels, ...detections.map((detection) => detection.label)])]
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false)
    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false)

    function handleToggleVisibility(id: string) {
        setDetections((prevDetections) =>
            prevDetections.map((detection) =>
                detection.id === id
                    ? {
                          ...detection,
                          visible: !detection.visible,
                      }
                    : detection,
            ),
        )
    }

    function handleModeChange(newMode: EditMode) {
        setMode(newMode)
        if (newMode === "Draw") {
            setSelectedDetectionId(null)
        }
    }

    function handleLabelChange(id: string, newLabel: string) {
        setDetections((prevDetections) =>
            prevDetections.map((detection) => (detection.id === id ? { ...detection, label: newLabel } : detection)),
        )
    }

    function handleDelete(id: string) {
        setDetections((prevDetections) => prevDetections.filter((detection) => detection.id !== id))
        if (selectedDetectionId === id) {
            setSelectedDetectionId(null)
        }
    }

    function handleBoxUpdate(detectionId: string, updatedBox: Detection["box"]) {
        setDetections((prevDetections) =>
            prevDetections.map((detection) =>
                detection.id === detectionId
                    ? {
                          ...detection,
                          box: updatedBox,
                      }
                    : detection,
            ),
        )
    }

    function handleBoxCreate(box: BoundingBox, label: string) {
        const newDetection: Detection = {
            id: crypto.randomUUID(),
            box,
            label,
            confidence: 1.0,
            visible: true,
            highlighted: false,
        }
        setDetections((prevDetections) => [...prevDetections, newDetection])
    }

    function isSameBox(box1: Detection["box"], box2: Detection["box"]): boolean {
        const epsilon = 0.01

        return (
            Math.abs(box1.x - box2.x) < epsilon &&
            Math.abs(box1.y - box2.y) < epsilon &&
            Math.abs(box1.width - box2.width) < epsilon &&
            Math.abs(box1.height - box2.height) < epsilon
        )
    }

    const isModified = useMemo(() => {
        const original = image.detections

        if (original.length !== detections.length) {
            return true
        }

        return original.some((oldDetection) => {
            const current = detections.find((detection) => detection.id === oldDetection.id)

            if (!current) return true

            if (current.label !== oldDetection.label) {
                return true
            }

            return !isSameBox(oldDetection.box, current.box)
        })
    }, [image.detections, detections])

    function handleConfirmSave() {
        detections.forEach((detection) => onAddLabel(detection.label))
        onSave(detections)
        setConfirmSaveOpen(false)
    }

    function handleClose() {
        if (isModified) {
            setConfirmDiscardOpen(true)
        } else {
            onClose()
        }
    }

    const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
        if (confirmSaveOpen || confirmDiscardOpen) {
            return
        }
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return
        }
        if ((event.target as HTMLElement).closest("input, textarea")) {
            return
        }

        const key = event.key.toLowerCase()
        switch (key) {
            case "v":
                handleModeChange("Select")
                event.preventDefault()
                break
            case "b":
                handleModeChange("Draw")
                event.preventDefault()
                break
            case "h":
                handleModeChange("Pan")
                event.preventDefault()
                break
            case "delete":
            case "backspace":
                if (selectedDetectionId) {
                    handleDelete(selectedDetectionId)
                    event.preventDefault()
                }
                break
            default:
                break
        }
    })

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <Dialog
            open={true}
            fullScreen
            onClose={(_, reason) => {
                if (reason === "escapeKeyDown") setSelectedDetectionId(null)
            }}
        >
            <EditHeader
                imageName={image.file.name}
                imageIndex={imageIndex}
                totalImages={totalImages}
                mode={mode}
                onModeChange={handleModeChange}
                onClose={handleClose}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    minHeight: 0,
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        backgroundColor: "grey.900",
                        p: 1,
                    }}
                >
                    <EditCanvas
                        imageUrl={image.previewUrl}
                        detections={detections}
                        selectedId={selectedDetectionId}
                        setSelectedId={setSelectedDetectionId}
                        colorForLabel={colorForLabel}
                        onBoxUpdate={handleBoxUpdate}
                        mode={mode}
                        onBoxCreate={handleBoxCreate}
                        labels={editorLabels}
                    />
                </Box>
                <Box
                    sx={{
                        width: "clamp(18rem, 25vw, 25rem)",
                        flexShrink: 0,
                        borderLeft: 1,
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
                        <BoxList
                            detections={detections}
                            selectedId={selectedDetectionId}
                            onSelect={setSelectedDetectionId}
                            onToggleVisibility={handleToggleVisibility}
                            onDelete={handleDelete}
                            colorForLabel={colorForLabel}
                        />

                        {selectedDetection && (
                            <>
                                <Divider />
                                <SelectedBoxPanel
                                    selectedBox={selectedDetection}
                                    onLabelChange={(newLabel) => handleLabelChange(selectedDetection.id, newLabel)}
                                    onDelete={() => handleDelete(selectedDetection.id)}
                                    labels={editorLabels}
                                />
                            </>
                        )}
                    </Box>
                    <Box sx={{ borderTop: 1, borderColor: "divider", px: 2, py: 1.5 }}>
                        <ShortcutLegend />
                    </Box>
                </Box>
            </Box>
            <DialogActions
                sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    px: 3,
                    py: 2,
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: isModified ? "warning.main" : "transparent",
                        }}
                    />

                    <Typography variant="body2">{isModified ? "Unsaved changes" : ""}</Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        variant="contained"
                        disabled={!isModified}
                        onClick={() => setConfirmSaveOpen(true)}
                    >
                        Save changes
                    </Button>
                </Box>
            </DialogActions>
            <Dialog open={confirmSaveOpen} onClose={() => setConfirmSaveOpen(false)}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6">Save changes?</Typography>

                    <Typography sx={{ mt: 1 }}>
                        All boxes will be set to 100% confidence. Removed boxes and boxes below the threshold will be
                        deleted. This can't be undone.
                    </Typography>

                    <DialogActions sx={{ mt: 2 }}>
                        <Button onClick={() => setConfirmSaveOpen(false)}>Go back</Button>
                        <Button variant="contained" onClick={handleConfirmSave}>
                            Confirm
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={confirmDiscardOpen} onClose={() => setConfirmDiscardOpen(false)}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6">Discard changes?</Typography>
                    <Typography sx={{ mt: 1 }}>Your changes to this image will be lost.</Typography>
                    <DialogActions sx={{ mt: 2 }}>
                        <Button onClick={() => setConfirmDiscardOpen(false)}>Keep editing</Button>
                        <Button variant="contained" color="error" onClick={onClose}>
                            Discard
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Dialog>
    )
}
