import { Box, Chip, Popover } from "@mui/material"
import { useState, type MouseEvent } from "react"
import { HslColorPicker } from "react-colorful"
import { PanelSection } from "../../../components/PanelSection.tsx"
import { EmptyState } from "../../../components/EmptyState.tsx"
import { parseHslString, toHslString } from "../../../utils/hslConversion.ts"
import { getContrastTextColor } from "../../../utils/labelColors.ts"
import { capitalizeFirstLetter } from "../../../utils/format.ts"

interface ColorPickerProps {
    labels: string[]
    colorForLabel: (label: string) => string
    setColorForLabel: (label: string, color: string) => void
}

export function LabelColors({ labels, colorForLabel, setColorForLabel }: ColorPickerProps) {
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    function handleChipClick(event: MouseEvent<HTMLElement>, label: string) {
        setSelectedLabel(label)
        setAnchorEl(event.currentTarget)
    }

    return (
        <PanelSection title="Color picker" tooltip="Customize the color used to highlight each class">
            {labels.length === 0 && <EmptyState message="No labels" />}

            {labels.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {labels.map(label => {
                        const color = colorForLabel(label)
                        return (
                            <Chip
                                key={label}
                                label={capitalizeFirstLetter(label)}
                                onClick={event => handleChipClick(event, label)}
                                sx={{ backgroundColor: color, color: getContrastTextColor(color) }}
                            />
                        )
                    })}
                </Box>
            )}

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                slotProps={{ transition: { onExited: () => setSelectedLabel(null) } }}
            >
                {selectedLabel && (
                    <Box sx={{ p: 2 }}>
                        <HslColorPicker
                            color={parseHslString(colorForLabel(selectedLabel))}
                            onChange={newColor => setColorForLabel(selectedLabel, toHslString(newColor))}
                        />
                    </Box>
                )}
            </Popover>
        </PanelSection>
    )
}