import { Group, Rect, Text } from "react-konva"
import type { Detection, Emphasis } from "../../types"
import { formatDetectionLabel } from "../../utils/format"
import { brighten, getContrastTextColor } from "../../utils/labelColors"

const LABEL_FONT_SIZE = 14
const LABEL_PADDING_X = 4
const LABEL_PADDING_Y = 2
const LABEL_OFFSET = 4

interface DetectionBoxProps {
    detection: Detection
    color: string
    emphasis: Emphasis
    // Current scale of the stage: used to keep the label the same size on screen
    viewScale: number
    detectionIndex: number
}

export function DetectionBox({ detection, color, emphasis, viewScale, detectionIndex }: DetectionBoxProps) {
    const { box } = detection
    const isHighlighted = emphasis === "highlighted"

    const displayColor = isHighlighted ? brighten(color) : color
    const textColor = getContrastTextColor(displayColor)
    const strokeWidth = isHighlighted ? 5 : 3
    const opacity = emphasis === "dimmed" ? 0.25 : 1

    const labelText = formatDetectionLabel(detection, detectionIndex)
    // Approximate text width: Konva can't measure it before rendering
    const labelWidth = labelText.length * (LABEL_FONT_SIZE * 0.6) + LABEL_PADDING_X * 2
    const labelHeight = LABEL_FONT_SIZE + LABEL_PADDING_Y * 2

    return (
        <Group opacity={opacity}>
            {/* Box in image coordinates; strokeScaleEnabled=false keeps the border width fixed on screen */}
            <Rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke={displayColor}
                strokeWidth={strokeWidth}
                strokeScaleEnabled={false}
                shadowBlur={10}
            />

            {/* Label in screen pixels: the inverse scale cancels the stage scale */}
            <Group x={box.x} y={box.y} scaleX={1 / viewScale} scaleY={1 / viewScale}>
                <Rect x={LABEL_OFFSET} y={LABEL_OFFSET} width={labelWidth} height={labelHeight} fill={displayColor} />
                <Text
                    x={LABEL_OFFSET + LABEL_PADDING_X}
                    y={LABEL_OFFSET + LABEL_PADDING_Y}
                    text={labelText}
                    fontSize={LABEL_FONT_SIZE}
                    fill={textColor}
                    fontStyle="bold"
                />
            </Group>
        </Group>
    )
}
