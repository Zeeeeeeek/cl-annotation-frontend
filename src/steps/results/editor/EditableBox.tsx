import type { Detection } from "../../../types.ts"
import { Group, Rect, Transformer } from "react-konva"
import { brighten } from "../../../utils/labelColors.ts"
import { DetectionLabel } from "../../../components/DetectionLabel.tsx"
import { useEffect, useRef, useState } from "react"
import Konva from "konva"
import type { KonvaEventObject } from "konva/lib/Node"
import { clamp, type Size } from "../../../hooks/useZoom.ts"

interface EditableBoxProps {
    detection: Detection
    detectionIndex: number
    color: string
    isSelected: boolean
    viewScale: number
    onSelect: (id: string) => void
    onBoxUpdate: (id: string, updatedBox: Detection["box"]) => void
    interactive: boolean
    imageSize: Size
}

export function EditableBox({
    detection,
    detectionIndex,
    color,
    isSelected,
    viewScale,
    onSelect,
    onBoxUpdate,
    interactive,
    imageSize,
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

    function handleDragMove(event: KonvaEventObject<DragEvent>) {
        const node = event.target
        const box = readBox(node)
        node.x(clamp(box.x, 0, imageSize.width - box.width))
        node.y(clamp(box.y, 0, imageSize.height - box.height))
        setLiveBox(readBox(node))
    }

    function handleMoveEnd(event: KonvaEventObject<Event>) {
        const node = event.target
        const box = readBox(node)
        const x = clamp(box.x, 0, imageSize.width)
        const y = clamp(box.y, 0, imageSize.height)
        const updatedBox = {
            x,
            y,
            width: Math.min(box.x + box.width, imageSize.width) - x,
            height: Math.min(box.y + box.height, imageSize.height) - y,
        }

        node.setAttrs({ ...updatedBox, scaleX: 1, scaleY: 1 })
        setLiveBox(null)
        onBoxUpdate(detection.id, updatedBox)
    }

    const labelBox = liveBox ?? detection.box

    return (
        <Group onClick={() => onSelect(detection.id)} onTap={() => onSelect(detection.id)} listening={interactive}>
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
                onDragMove={handleDragMove}
                onTransform={handleMove}
                onDragEnd={handleMoveEnd}
                onTransformEnd={handleMoveEnd}
                ref={rectRef}
                dragDistance={3}
            />
            <DetectionLabel
                detection={detection}
                detectionIndex={detectionIndex}
                displayColor={displayColor}
                viewScale={viewScale}
                x={labelBox.x}
                y={labelBox.y}
            />
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    keepRatio={false}
                    ignoreStroke
                    flipEnabled={false}
                />
            )}
        </Group>
    )
}
