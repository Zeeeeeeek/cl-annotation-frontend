import { AppBar, Box, IconButton, Stack, ToggleButtonGroup, Toolbar, Typography } from "@mui/material"
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined"
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined"
import CloseIcon from "@mui/icons-material/Close"
import type { EditMode } from "../../../types"
import type { MouseEvent } from "react"
import { ModeToggleButton } from "./ModeToggleButton.tsx"

export interface EditHeaderProps {
    imageName: string
    imageIndex: number
    totalImages: number
    mode: EditMode
    onModeChange: (mode: EditMode) => void
    onClose: () => void
}

export function EditHeader({ imageName, imageIndex, totalImages, mode, onModeChange, onClose }: EditHeaderProps) {
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
                    <ModeToggleButton
                        text={"Select"}
                        keyboardShortcut={"V"}
                        icon={<NearMeOutlinedIcon fontSize={"small"} />}
                        value={"Select"}
                    />
                    <ModeToggleButton
                        text={"Draw"}
                        keyboardShortcut={"B"}
                        icon={<AddBoxOutlinedIcon fontSize={"small"} />}
                        value={"Draw"}
                    />
                </ToggleButtonGroup>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton edge="end" aria-label="Close editor" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
