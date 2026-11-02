import { Box, Dialog, Divider } from "@mui/material"
import { useState } from "react"
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
import { updateById } from "../../../utils/arrays.ts"
import { useEditorShortcuts } from "../../../hooks/useEditorShortcuts.ts"

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
    const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
    const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false)

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
        changeDetections((prevDetections) => updateById(prevDetections, id, { label: newLabel }))
    }

    function handleDelete(id: string) {
        changeDetections((prevDetections) => prevDetections.filter((detection) => detection.id !== id))
        if (selectedDetectionId === id) {
            setSelectedDetectionId(null)
        }
    }

    function handleBoxUpdate(detectionId: string, updatedBox: BoundingBox) {
        changeDetections((prevDetections) => updateById(prevDetections, detectionId, { box: updatedBox }))
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
        setIsSaveConfirmOpen(false)
    }

    function handleClose() {
        if (isModified) {
            setIsDiscardConfirmOpen(true)
        } else {
            onClose()
        }
    }

    useEditorShortcuts({
        isEnabled: !isSaveConfirmOpen && !isDiscardConfirmOpen,
        selectedId: selectedDetection?.id ?? null,
        onModeChange: handleModeChange,
        onDelete: handleDelete,
        onUndo: undo,
        onRedo: redo,
    })

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
                        onSelect={setSelectedDetectionId}
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
            <EditFooter isModified={isModified} onCancel={handleClose} onSave={() => setIsSaveConfirmOpen(true)} />
            <ConfirmDialog
                isOpen={isSaveConfirmOpen}
                title="Save changes?"
                message={
                    "All boxes will be set to 100% confidence. Removed boxes and boxes below the threshold " +
                    "will be deleted. This can't be undone."
                }
                cancelLabel="Go back"
                confirmLabel="Confirm"
                onCancel={() => setIsSaveConfirmOpen(false)}
                onConfirm={handleConfirmSave}
            />
            <ConfirmDialog
                isOpen={isDiscardConfirmOpen}
                title="Discard changes?"
                message="Your changes to this image will be lost."
                cancelLabel="Keep editing"
                confirmLabel="Discard"
                confirmColor="error"
                onCancel={() => setIsDiscardConfirmOpen(false)}
                onConfirm={onClose}
            />
        </Dialog>
    )
}
