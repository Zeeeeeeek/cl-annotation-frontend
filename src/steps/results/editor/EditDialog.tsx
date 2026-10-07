import {Box, Button, Dialog, DialogActions, Divider} from "@mui/material"
import {useState} from "react"
import type {Detection, EditMode, ImageItem} from "../../../types"
import {EditHeader} from "./EditHeader.tsx"
import {BoxList} from "./BoxList.tsx"
import {SelectedBoxPanel} from "./SelectedBoxPanel.tsx";
import {ShortcutLegend} from "./ShortcutLegend.tsx";

interface EditDialogProps {
    image: ImageItem,
    imageIndex: number,
    totalImages: number,
    onClose: () => void,
    onSave: (updatedDetections: Detection[]) => void
}

export function EditDialog({image, imageIndex, totalImages, onClose, onSave}: EditDialogProps) {
    const [mode, setMode] = useState<EditMode>("Select")
    const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null)

    const [detections, setDetections] = useState<Detection[]>(image.detections)
    const selectedDetection = detections.find(d => d.id === selectedDetectionId) || null

    function handleToggleVisibility(id: string) {
        setDetections(prevDetections =>
            prevDetections.map(detection => detection.id === id ? {
                ...detection,
                visible: !detection.visible
            } : detection)
        )
    }

    function handleLabelChange(id: string, newLabel: string) {
        setDetections(prevDetections =>
            prevDetections.map(detection => detection.id === id ? {...detection, label: newLabel} : detection))
    }

    function handleDelete(id: string) {
        setDetections(prevDetections => prevDetections.filter(detection => detection.id !== id))
        if (selectedDetectionId === id) {
            setSelectedDetectionId(null)
        }
    }

    return (
        <Dialog open={true} fullScreen>
            <EditHeader
                imageName={image.file.name}
                imageIndex={imageIndex}
                totalImages={totalImages}
                mode={mode}
                onModeChange={setMode}
                onClose={onClose}
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
                    }}
                ></Box>
                <Box
                    sx={{
                        width: "clamp(18rem, 25vw, 25rem)",
                        flexShrink: 0,
                        borderLeft: 1,
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Box sx={{p: 2, display: "flex", flexDirection: "column", minHeight: 0, flex: 1}}>
                        <BoxList
                            detections={detections}
                            selectedId={selectedDetectionId}
                            onSelect={setSelectedDetectionId}
                            onToggleVisibility={handleToggleVisibility}
                            onDelete={handleDelete}
                        />

                        {selectedDetection && (
                            <>
                                <Divider/>
                                <SelectedBoxPanel
                                    selectedBox={selectedDetection}
                                    onLabelChange={(newLabel) => handleLabelChange(selectedDetection.id, newLabel)}
                                    onDelete={() => handleDelete(selectedDetection.id)}
                                />
                            </>
                        )}
                    </Box>
                    <Box sx={{borderTop: 1, borderColor: "divider", px: 2, py: 1.5}}>
                        <ShortcutLegend/>
                    </Box>
                </Box>
            </Box>
            <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 3, py: 2}}>
                <Button color="error" variant="text" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="primary" variant="contained" onClick={() => onSave(detections)}>
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
