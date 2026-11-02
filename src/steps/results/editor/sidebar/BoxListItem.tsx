import type { Detection } from "../../../../types.ts"
import { Box, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import { formatConfidence } from "../../../../utils/format.ts"

interface BoxListItemProps {
    detection: Detection
    name: string
    color: string
    isSelected: boolean
    onSelect: (id: string) => void
    onToggleVisibility: (id: string) => void
    onDelete: (id: string) => void
}

export function BoxListItem({
    detection,
    name,
    color,
    isSelected,
    onSelect,
    onToggleVisibility,
    onDelete,
}: BoxListItemProps) {
    return (
        <ListItem
            disablePadding
            secondaryAction={
                <Stack direction="row">
                    <IconButton
                        size="small"
                        aria-label={detection.visible ? `Hide ${name}` : `Show ${name}`}
                        onClick={() => onToggleVisibility(detection.id)}
                    >
                        {detection.visible ? (
                            <VisibilityOutlinedIcon fontSize="small" />
                        ) : (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                        )}
                    </IconButton>
                    <IconButton
                        size="small"
                        edge="end"
                        aria-label={`Delete ${name}`}
                        onClick={() => onDelete(detection.id)}
                    >
                        <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                </Stack>
            }
        >
            <ListItemButton
                dense
                selected={isSelected}
                onClick={() => onSelect(detection.id)}
                sx={{ pr: 10, borderRadius: 1 }}
            >
                <ListItemIcon sx={{ minWidth: "2rem" }}>
                    <Box
                        sx={{
                            backgroundColor: color,
                            width: "1rem",
                            height: "1rem",
                            borderRadius: "30%",
                        }}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={name}
                    secondary={formatConfidence(detection.confidence)}
                    sx={{ opacity: detection.visible ? 1 : 0.5 }}
                />
            </ListItemButton>
        </ListItem>
    )
}
