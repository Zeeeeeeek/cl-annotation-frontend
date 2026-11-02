import type { BoundingBox, Detection, Size } from "../../../../types.ts"
import { Group, Rect, Transformer } from "react-konva"
import { brighten } from "../../../../utils/labelColors.ts"
import { DetectionLabel } from "../../../../components/DetectionLabel.tsx"
import { useEffect, useRef, useState } from "react"
import Konva from "konva"
import type { KonvaEventObject } from "konva/lib/Node"
import { clamp } from "../../../../utils/math.ts"
import {clampBoxToImage} from "../../../../utils/detections.ts";

interface EditableBoxProps {
    detection: Detection
    detectionIndex: number
    color: string
    isSelected: boolean
    viewScale: number
    onSelect: (id: string) => void
    onBoxUpdate: (id: string, updatedBox: BoundingBox) => void
    isInteractive: boolean
    imageSize: Size
}

function readBox(node: Konva.Node): BoundingBox {
    return {
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
    }
}

export function EditableBox({
    detection,
    detectionIndex,
    color,
    isSelected,
    viewScale,
    onSelect,
    onBoxUpdate,
    isInteractive,
    imageSize,
}: EditableBoxProps) {
    const rectRef = useRef<Konva.Rect>(null)
    const transformerRef = useRef<Konva.Transformer>(null)
    const [liveBox, setLiveBox] = useState<BoundingBox | null>(null)

    const displayColor = isSelected ? brighten(color) : color
    const strokeWidth = isSelected ? 5 : 3
    const labelBox = liveBox ?? detection.box

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
        const updatedBox = clampBoxToImage(readBox(event.target), imageSize)
        event.target.setAttrs({ ...updatedBox, scaleX: 1, scaleY: 1 })
        setLiveBox(null)
        onBoxUpdate(detection.id, updatedBox)
    }

    useEffect(() => {
        if (isSelected && rectRef.current && transformerRef.current) {
            transformerRef.current.nodes([rectRef.current])
        }
    }, [isSelected])

    return (
        <Group onClick={() => onSelect(detection.id)} onTap={() => onSelect(detection.id)} listening={isInteractive}>
            <Rect
                {...detection.box}
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
