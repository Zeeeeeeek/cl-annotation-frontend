import { Box, Button, Dialog, DialogActions, Divider, Typography } from "@mui/material"
import { useEffect, useEffectEvent, useState } from "react"
import type { BoundingBox, Detection, EditMode, ImageItem } from "../../../types"
import { EditHeader } from "./EditHeader.tsx"
import { BoxList } from "./BoxList.tsx"
import { SelectedBoxPanel } from "./SelectedBoxPanel.tsx"
import { ShortcutLegend } from "./ShortcutLegend.tsx"
import { EditCanvas } from "./EditCanvas.tsx"
import { haveDetectionsChanged } from "../../../utils/detections.ts"

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
    const isModified = haveDetectionsChanged(image.detections, detections)
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false)
    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false)

    const [past, setPast] = useState<Detection[][]>([])
    const [future, setFuture] = useState<Detection[][]>([])

    function changeDetections(update: (prev: Detection[]) => Detection[]) {
        setPast((prev) => [...prev, detections])
        setFuture([])
        setDetections(update)
    }

    function handleToggleVisibility(id: string) {
        changeDetections((prevDetections) =>
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
        changeDetections((prevDetections) =>
            prevDetections.map((detection) => (detection.id === id ? { ...detection, label: newLabel } : detection)),
        )
    }

    function handleDelete(id: string) {
        changeDetections((prevDetections) => prevDetections.filter((detection) => detection.id !== id))
        if (selectedDetectionId === id) {
            setSelectedDetectionId(null)
        }
    }

    function handleBoxUpdate(detectionId: string, updatedBox: BoundingBox) {
        changeDetections((prevDetections) =>
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
        changeDetections((prevDetections) => [...prevDetections, newDetection])
    }

    function undo() {
        const previous = past.at(-1)
        if (!previous) return
        setPast(past.slice(0, -1))
        setFuture([detections, ...future])
        restore(previous)
    }

    function redo() {
        const next = future[0]
        if (!next) return
        setFuture(future.slice(1))
        setPast([...past, detections])
        restore(next)
    }

    function restore(snapshot: Detection[]) {
        setDetections(snapshot)
        if (!snapshot.some((detection) => detection.id === selectedDetectionId)) {
            setSelectedDetectionId(null)
        }
    }

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
        if ((event.target as HTMLElement).closest("input, textarea")) {
            return
        }

        const key = event.key.toLowerCase()

        if ((event.ctrlKey || event.metaKey) && key === "z") {
            event.preventDefault()
            if (event.shiftKey) {
                redo()
            } else {
                undo()
            }
            return
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return
        }

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
                canUndo={past.length > 0}
                canRedo={future.length > 0}
                onUndo={undo}
                onRedo={redo}
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
