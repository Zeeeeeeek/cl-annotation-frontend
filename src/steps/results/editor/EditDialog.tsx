import { Box, Button, Dialog, DialogActions } from "@mui/material"
import { useState } from "react"
import type { Detection, EditMode } from "../../../types"
import { EditHeader } from "./EditHeader.tsx"
import { BoxList } from "./BoxList.tsx"

const tempDetections: Detection[] = [
    {
        id: "d1",
        label: "person",
        index: 1,
        confidence: 0.98,
        visible: true,
        highlighted: false,
        box: { x: 412, y: 96, width: 260, height: 540 },
    },
    {
        id: "d2",
        label: "person",
        index: 2,
        confidence: 0.87,
        visible: true,
        highlighted: false,
        box: { x: 110, y: 170, width: 190, height: 420 },
    },
    {
        id: "d3",
        label: "car",
        index: 1,
        confidence: 0.92,
        visible: true,
        highlighted: false,
        box: { x: 700, y: 300, width: 380, height: 210 },
    },
    {
        id: "d4",
        label: "bicycle",
        index: 1,
        confidence: 0.75,
        visible: false,
        highlighted: false,
        box: { x: 300, y: 420, width: 220, height: 160 },
    },
]

export function EditDialog() {
    const [mode, setMode] = useState<EditMode>("Select")

    return (
        <Dialog open={true} fullScreen>
            <EditHeader
                imageName="img aaaaa"
                imageIndex={1}
                totalImages={12}
                mode={mode}
                onModeChange={setMode}
                onClose={() => {}}
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
                        p: 2,
                        borderLeft: 1,
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <BoxList
                        detections={tempDetections}
                        selectedId={null}
                        onSelect={() => {}}
                        onToggleVisibility={() => {}}
                        onDelete={() => {}}
                    />
                </Box>
            </Box>
            <DialogActions sx={{ borderTop: 1, borderColor: "divider", px: 3, py: 2 }}>
                <Button color="error" variant="text">
                    Cancel
                </Button>
                <Button color="primary" variant="contained">
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
