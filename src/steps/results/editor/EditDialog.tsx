import { Box, Dialog, Divider } from "@mui/material"
import { useEffect, useEffectEvent, useState } from "react"
import type { BoundingBox, Detection, EditMode, ImageItem } from "../../../types"
import { EditHeader } from "./EditHeader.tsx"
import { BoxList } from "./BoxList.tsx"
import { SelectedBoxPanel } from "./SelectedBoxPanel.tsx"
import { ShortcutLegend } from "./ShortcutLegend.tsx"
import { EditCanvas } from "./EditCanvas.tsx"
import { haveDetectionsChanged } from "../../../utils/detections.ts"
import { useDetectionHistory } from "../../../hooks/useDetectionHistory.ts"
import { ConfirmDialog } from "../../../components/ConfirmDialog.tsx"
import { EditFooter } from "./EditFooter.tsx"

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
    const { detections, changeDetections, undo, redo, canUndo, canRedo } = useDetectionHistory(image.detections)
    const [mode, setMode] = useState<EditMode>("Select")
    const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null)
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false)
    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false)

    const selectedDetection = detections.find((d) => d.id === selectedDetectionId) || null
    const editorLabels = [...new Set([...labels, ...detections.map((detection) => detection.label)])]
    const isModified = haveDetectionsChanged(image.detections, detections)

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
                if (selectedDetection) {
                    handleDelete(selectedDetection.id)
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
                canUndo={canUndo}
                canRedo={canRedo}
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
                        selectedId={selectedDetection?.id ?? null}
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
                            selectedId={selectedDetection?.id ?? null}
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
            <EditFooter isModified={isModified} onCancel={handleClose} onSave={() => setConfirmSaveOpen(true)} />
            <ConfirmDialog
                isOpen={confirmSaveOpen}
                title="Save changes?"
                message={
                    "All boxes will be set to 100% confidence. Removed boxes and boxes below the threshold " +
                    "will be deleted. This can't be undone."
                }
                cancelLabel="Go back"
                confirmLabel="Confirm"
                onCancel={() => setConfirmSaveOpen(false)}
                onConfirm={handleConfirmSave}
            />
            <ConfirmDialog
                isOpen={confirmDiscardOpen}
                title="Discard changes?"
                message="Your changes to this image will be lost."
                cancelLabel="Keep editing"
                confirmLabel="Discard"
                confirmColor="error"
                onCancel={() => setConfirmDiscardOpen(false)}
                onConfirm={onClose}
            />
        </Dialog>
    )
}
