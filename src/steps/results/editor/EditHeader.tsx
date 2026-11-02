import { AppBar, Box, IconButton, Stack, ToggleButtonGroup, Toolbar, Tooltip, Typography } from "@mui/material"
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined"
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined"
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined"
import RedoIcon from "@mui/icons-material/Redo"
import UndoIcon from "@mui/icons-material/Undo"
import CloseIcon from "@mui/icons-material/Close"
import type { EditMode } from "../../../types"
import type { MouseEvent, ReactNode } from "react"
import { ModeToggleButton } from "./ModeToggleButton.tsx"

export interface EditHeaderProps {
    imageName: string
    imageIndex: number
    totalImages: number
    mode: EditMode
    onModeChange: (mode: EditMode) => void
    onClose: () => void
    canUndo: boolean
    canRedo: boolean
    onUndo: () => void
    onRedo: () => void
}

const EDIT_MODES: { value: EditMode; shortcut: string; icon: ReactNode }[] = [
    { value: "Select", shortcut: "V", icon: <NearMeOutlinedIcon fontSize="small" /> },
    { value: "Draw", shortcut: "B", icon: <AddBoxOutlinedIcon fontSize="small" /> },
    { value: "Pan", shortcut: "H", icon: <PanToolOutlinedIcon fontSize="small" /> },
]

export function EditHeader({
    imageName,
    imageIndex,
    totalImages,
    mode,
    onModeChange,
    onClose,
    onRedo,
    canRedo,
    canUndo,
    onUndo,
}: EditHeaderProps) {
    function handleModeChange(_: MouseEvent<HTMLElement>, newMode: EditMode | null) {
        if (!newMode) return
        onModeChange(newMode)
    }

    return (
        <AppBar color="inherit" elevation={0} position={"relative"} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Toolbar sx={{ gap: 2 }}>
                <Stack>
                    <Typography variant={"h6"}> Edit annotations </Typography>
                    <Typography variant={"body2"} color={"text.secondary"}>
                        {imageName} · image {imageIndex} of {totalImages}
                    </Typography>
                </Stack>
                <ToggleButtonGroup exclusive value={mode} onChange={handleModeChange} color={"primary"} size={"small"}>
                    {EDIT_MODES.map(({ value, shortcut, icon }) => (
                        <ModeToggleButton
                            key={value}
                            value={value}
                            text={value}
                            keyboardShortcut={shortcut}
                            icon={icon}
                        />
                    ))}
                </ToggleButtonGroup>
                <Stack direction="row">
                    <Tooltip title="Undo (Ctrl+Z)">
                        <span>
                            <IconButton onClick={onUndo} disabled={!canUndo} aria-label="Undo">
                                <UndoIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Redo (Ctrl+Shift+Z)">
                        <span>
                            <IconButton onClick={onRedo} disabled={!canRedo} aria-label="Redo">
                                <RedoIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton edge="end" aria-label="Close editor" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
