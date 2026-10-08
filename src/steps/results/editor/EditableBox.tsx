import type { Detection } from "../../../types.ts"
import { Group, Rect } from "react-konva"
import { brighten } from "../../../utils/labelColors.ts"
import { DetectionLabel } from "../../../components/DetectionLabel.tsx"

interface EditableBoxProps {
    detection: Detection
    detectionIndex: number
    color: string
    isSelected: boolean
    viewScale: number
    onSelect: () => void
}

export function EditableBox({ detection, detectionIndex, color, isSelected, viewScale, onSelect }: EditableBoxProps) {
    const displayColor = isSelected ? brighten(color) : color
    const strokeWidth = isSelected ? 5 : 3

    return (
        <Group onClick={onSelect} onTap={onSelect}>
            <Rect
                x={detection.box.x}
                y={detection.box.y}
                width={detection.box.width}
                height={detection.box.height}
                stroke={displayColor}
                strokeWidth={strokeWidth}
                strokeScaleEnabled={false}
                shadowBlur={10}
                fill={"transparent"}
            />
            <DetectionLabel
                detection={detection}
                detectionIndex={detectionIndex}
                displayColor={displayColor}
                viewScale={viewScale}
            />
        </Group>
    )
}
