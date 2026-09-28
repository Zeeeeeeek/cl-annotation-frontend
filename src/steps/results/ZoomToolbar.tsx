import { IconButton, Paper, Slider, Tooltip, Typography } from "@mui/material"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import FitScreenIcon from "@mui/icons-material/FitScreen"
import { MAX_ZOOM, MIN_ZOOM } from "../../hooks/useZoom"

// Each click on + / − multiplies or divides the zoom by this factor
const ZOOM_BUTTON_FACTOR = 1.25

interface ZoomToolbarProps {
    zoom: number
    onZoomChange: (zoom: number) => void
    onReset: () => void
}

export function ZoomToolbar({ zoom, onZoomChange, onReset }: ZoomToolbarProps) {
    const isMinZoom = zoom <= MIN_ZOOM
    const isMaxZoom = zoom >= MAX_ZOOM

    return (
        <Paper
            elevation={3}
            sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.5,
                borderRadius: 999,
                // Semi-transparent with blur: readable, but covers as little as possible of the image
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(6px)",
                cursor: "default",
            }}
        >
            <IconButton size="small" onClick={() => onZoomChange(zoom / ZOOM_BUTTON_FACTOR)} disabled={isMinZoom} aria-label="Zoom out">
                <ZoomOutIcon fontSize="small" />
            </IconButton>

            <Slider
                size="small"
                value={zoom}
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                onChange={(_, value) => onZoomChange(value as number)}
                aria-label="Zoom"
                sx={{ width: 120 }}
            />

            <IconButton size="small" onClick={() => onZoomChange(zoom * ZOOM_BUTTON_FACTOR)} disabled={isMaxZoom} aria-label="Zoom in">
                <ZoomInIcon fontSize="small" />
            </IconButton>

            {/* Fixed width so the toolbar doesn't change size while the number changes */}
            <Typography variant="body2" sx={{ width: "4.5ch", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {Math.round(zoom * 100)}%
            </Typography>

            <Tooltip title="Fit image">
                <span>
                    <IconButton size="small" onClick={onReset} disabled={isMinZoom} aria-label="Fit image">
                        <FitScreenIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
        </Paper>
    )
}