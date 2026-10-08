import type { Detection } from "../types.ts"
import { getContrastTextColor } from "../utils/labelColors.ts"
import { formatDetectionLabel } from "../utils/format.ts"
import { Group, Rect, Text } from "react-konva"

export const LABEL_FONT_SIZE = 14
export const LABEL_PADDING_X = 4
export const LABEL_PADDING_Y = 2
export const LABEL_OFFSET = 4

interface DetectionLabelProps {
    detection: Detection
    detectionIndex: number
    displayColor: string
    viewScale: number
}

export function DetectionLabel({ detection, detectionIndex, displayColor, viewScale }: DetectionLabelProps) {
    const { box } = detection
    const textColor = getContrastTextColor(displayColor)
    const labelText = formatDetectionLabel(detection, detectionIndex)

    // Approximate text width: Konva can't measure it before rendering
    const labelWidth = labelText.length * (LABEL_FONT_SIZE * 0.6) + LABEL_PADDING_X * 2
    const labelHeight = LABEL_FONT_SIZE + LABEL_PADDING_Y * 2

    return (
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
    )
}
