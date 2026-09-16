import {Box, Chip, Typography, Popover, Tooltip} from "@mui/material";
import { useState, type MouseEvent } from "react";
import { HslColorPicker } from "react-colorful";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { parseHslString, toHslString } from "../../utils/hslConversion.ts";
import {getContrastTextColor} from "../../utils/labelColors.ts";

interface ColorPickerProps {
    labels: (string | undefined | null)[];
    colorForLabel: (label: string) => string;
    setColorForLabel: (label: string, color: string) => void;
}

function labelCapitalizeFirstLetter(label: string): string {
    if (!label) return label;
    return label.charAt(0).toUpperCase() + label.slice(1);
}

export function ColorPicker({ labels, colorForLabel, setColorForLabel }: ColorPickerProps) {
    const uniqueLabels = [...new Set(labels.filter((label): label is string => Boolean(label)))];
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    function handleChipClick(event: MouseEvent<HTMLElement>, label: string) {
        setSelectedLabel(label);
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <Box sx={{ maxHeight: 150, display: 'flex', flexDirection: 'column' }}>
            <Typography gutterBottom>
                <Tooltip title="Customize the color used to highlight each class" arrow>
                    <span>Color picker</span>
                </Tooltip>
            </Typography>

            <Box sx={{ overflowY: 'auto', flexGrow: 1, pb: 1 }}>
                {uniqueLabels.length === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, color: 'text.secondary' }}>
                        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 32, mb: 0.5 }} />
                        <Typography variant="body2">No labels</Typography>
                    </Box>
                )}

                {uniqueLabels.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {uniqueLabels.map(label => (
                            <Chip
                                key={label}
                                label={labelCapitalizeFirstLetter(label)}
                                onClick={(event) => handleChipClick(event, label)}
                                variant="filled"
                                sx={{ bgcolor: colorForLabel(label), color: getContrastTextColor(colorForLabel(label)) }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={{
                    transition: {
                        onExited: () => setSelectedLabel(null),
                    },
                }}
            >
                {selectedLabel && (
                    <Box sx={{ p: 2 }}>
                        <HslColorPicker
                            color={parseHslString(colorForLabel(selectedLabel))}
                            onChange={(newColor) => setColorForLabel(selectedLabel, toHslString(newColor))}
                        />
                    </Box>
                )}
            </Popover>
        </Box>
    );
}