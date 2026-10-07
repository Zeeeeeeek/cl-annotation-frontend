import type { Detection } from "../../../types.ts"
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import { COCO_LABELS } from "../../../constants/cocoLabels.ts"

interface SelectedBoxPanelProps {
    selectedBox: Detection
    onLabelChange: (newLabel: string) => void
    onDelete: () => void
}

export function SelectedBoxPanel({ selectedBox, onLabelChange, onDelete }: SelectedBoxPanelProps) {
    const { x, y, width, height } = selectedBox.box
    const coordinates = [
        { name: "X", value: x },
        { name: "Y", value: y },
        { name: "W", value: width },
        { name: "H", value: height },
    ]

    return (
        <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" component="div" sx={{ mb: 1.5 }}>
                Selected box
            </Typography>

            <Autocomplete
                disableClearable
                options={COCO_LABELS}
                value={selectedBox.label}
                onChange={(_, newValue) => onLabelChange(newValue)}
                renderInput={(params) => <TextField {...params} label="Label" />}
            />

            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Position in original image (px)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                {coordinates.map(({ name, value }) => (
                    <Box
                        key={name}
                        sx={{
                            flex: 1,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: "grey.100",
                            typography: "body2",
                        }}
                    >
                        {name} {Math.round(value)}
                    </Box>
                ))}
            </Box>

            <Button variant="outlined" color="error" fullWidth startIcon={<DeleteOutlinedIcon />} onClick={onDelete}>
                Delete box
            </Button>
        </Box>
    )
}
