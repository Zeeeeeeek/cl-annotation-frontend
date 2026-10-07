import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined"
import type {Detection} from "../../../types"
import {formatConfidence, formatDetectionName} from "../../../utils/format.ts"
import {getDetectionIndexes} from "../../../utils/detections.ts";

interface BoxListProps {
    detections: Detection[]
    selectedId: string | null
    onSelect: (id: string) => void
    onToggleVisibility: (id: string) => void
    onDelete: (id: string) => void
}

export function BoxList({detections, selectedId, onSelect, onToggleVisibility, onDelete}: BoxListProps) {
    const detectionsIndexes = getDetectionIndexes(detections)

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: 0}}>
            <Stack direction="row" spacing={1} sx={{alignItems: "baseline"}}>
                <Typography variant="subtitle1">Boxes</Typography>
                <Typography variant="body2" color="text.secondary">
                    {detections.length}
                </Typography>
            </Stack>
            <Box sx={{flex: "0 1 auto", minHeight: 0, overflowY: "auto"}}>
                <List>
                    {detections.map((detection) => {
                        const name = formatDetectionName(detection, detectionsIndexes.get(detection.id) ?? 0)

                        return (
                            <ListItem
                                key={detection.id}
                                disablePadding
                                secondaryAction={
                                    <Stack direction="row">
                                        <IconButton
                                            size="small"
                                            aria-label={detection.visible ? `Hide ${name}` : `Show ${name}`}
                                            onClick={() => onToggleVisibility(detection.id)}
                                        >
                                            {detection.visible ? (
                                                <VisibilityOutlinedIcon fontSize="small"/>
                                            ) : (
                                                <VisibilityOffOutlinedIcon fontSize="small"/>
                                            )}
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            edge="end"
                                            aria-label={`Delete ${name}`}
                                            onClick={() => onDelete(detection.id)}
                                        >
                                            <DeleteOutlinedIcon fontSize="small"/>
                                        </IconButton>
                                    </Stack>
                                }
                            >
                                <ListItemButton
                                    dense
                                    selected={detection.id === selectedId}
                                    onClick={() => onSelect(detection.id)}
                                    sx={{pr: 10, borderRadius: 1}}
                                >
                                    <ListItemIcon sx={{minWidth: "2rem"}}>
                                        {/* TODO: replace the placeholder with the label color */}
                                        <Box
                                            sx={{
                                                backgroundColor: "red",
                                                width: "1rem",
                                                height: "1rem",
                                                borderRadius: "30%",
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={name}
                                        secondary={formatConfidence(detection.confidence)}
                                        sx={{opacity: detection.visible ? 1 : 0.5}}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        </Box>
    )
}
