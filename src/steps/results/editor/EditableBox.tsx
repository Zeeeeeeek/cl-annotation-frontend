import type { Detection } from "../../../types.ts"
import { Group, Rect, Transformer } from "react-konva"
import { brighten } from "../../../utils/labelColors.ts"
import { DetectionLabel } from "../../../components/DetectionLabel.tsx"
import { useEffect, useRef, useState } from "react"
import Konva from "konva"
import type { KonvaEventObject } from "konva/lib/Node"

interface EditableBoxProps {
    detection: Detection
    detectionIndex: number
    color: string
    isSelected: boolean
    viewScale: number
    onSelect: () => void
    onBoxUpdate: (updatedBox: Detection["box"]) => void
}

export function EditableBox({
    detection,
    detectionIndex,
    color,
    isSelected,
    viewScale,
    onSelect,
    onBoxUpdate,
}: EditableBoxProps) {
    const displayColor = isSelected ? brighten(color) : color
    const strokeWidth = isSelected ? 5 : 3

    const rectRef = useRef<Konva.Rect>(null)
    const transformerRef = useRef<Konva.Transformer>(null)

    useEffect(() => {
        if (isSelected && rectRef.current && transformerRef.current) {
            transformerRef.current.nodes([rectRef.current])
        }
    }, [isSelected])

    const [liveBox, setLiveBox] = useState<Detection["box"] | null>(null)

    function readBox(node: Konva.Node): Detection["box"] {
        return {
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
        }
    }

    function handleMove(event: KonvaEventObject<Event>) {
        setLiveBox(readBox(event.target))
    }

    function handleMoveEnd(event: KonvaEventObject<Event>) {
        const updatedBox = readBox(event.target)
        event.target.scaleX(1)
        event.target.scaleY(1)
        setLiveBox(null)
        onBoxUpdate(updatedBox)
    }

    const labelBox = liveBox ?? detection.box

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
                fill={"transparent"}
                draggable={isSelected}
                onDragMove={handleMove}
                onTransform={handleMove}
                onDragEnd={handleMoveEnd}
                onTransformEnd={handleMoveEnd}
                ref={rectRef}
            />
            <DetectionLabel
                detection={detection}
                detectionIndex={detectionIndex}
                displayColor={displayColor}
                viewScale={viewScale}
                x={labelBox.x}
                y={labelBox.y}
            />
            {isSelected && <Transformer ref={transformerRef} rotateEnabled={false} keepRatio={false} ignoreStroke />}
        </Group>
    )
}
