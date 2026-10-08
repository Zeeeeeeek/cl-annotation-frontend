import type { Detection } from "../../../types.ts"
import { Group, Rect, Transformer } from "react-konva"
import { brighten } from "../../../utils/labelColors.ts"
import { DetectionLabel } from "../../../components/DetectionLabel.tsx"
import { useEffect, useRef } from "react"
import Konva from "konva"

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

    const rectRef = useRef<Konva.Rect>(null)
    const transformerRef = useRef<Konva.Transformer>(null)
    useEffect(() => {
        if (isSelected && rectRef.current && transformerRef.current) {
            transformerRef.current.nodes([rectRef.current])
        }
    }, [isSelected])

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
                draggable
                onDragEnd={(e) => {
                    console.log(`Drag end: ${e.target.x()}, ${e.target.y()}`)
                }}
            />
            <DetectionLabel
                detection={detection}
                detectionIndex={detectionIndex}
                displayColor={displayColor}
                viewScale={viewScale}
            />
            {isSelected && <Transformer ref={transformerRef} rotateEnabled={false} keepRatio={false} />}
        </Group>
    )
}
