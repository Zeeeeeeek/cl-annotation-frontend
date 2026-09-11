import { useMemo } from "react";
import {Stage, Layer, Image, Rect, Text} from 'react-konva';
import type { BoundingBox, ImageResult } from "../api/detectionApi.ts";
import useImage from "use-image";

interface ResultsViewProps {
    results: ImageResult[];
}

function scaleBox(box: BoundingBox, scale: number): BoundingBox {
    return {
        x: box.x * scale,
        y: box.y * scale,
        width: box.width * scale,
        height: box.height * scale,
    };
}

export function ResultsVisualizer({ results }: ResultsViewProps) {
    const imageUrl = useMemo(() => URL.createObjectURL(results[0].file), [results]);
    const [image] = useImage(imageUrl);
    const maxWidth = 800;
    const scale = image ? Math.min(1, maxWidth / image.width) : 1;
    const stageWidth = image ? image.width * scale : maxWidth;
    const stageHeight = image ? image.height * scale : 0;

    return (
        <Stage width={stageWidth} height={stageHeight}>
            <Layer>
                {image && (
                    <>
                        <Image image={image} width={stageWidth} height={stageHeight} />
                        {results[0].detections.map((detection, index) => {
                            const box = scaleBox(detection.box, scale);
                            return (
                                <>
                                    <Rect
                                        key={`box-${index}`}
                                        x={box.x}
                                        y={box.y}
                                        width={box.width}
                                        height={box.height}
                                        fillEnabled={false}
                                        stroke="red"
                                        strokeWidth={3}
                                        shadowBlur={10}
                                    />
                                    <Text
                                        key={`label-${index}`}
                                        x={box.x + 4}
                                        y={box.y + 4}
                                        text={`${detection.label} ${(detection.confidence * 100).toFixed(0)}%`}
                                        fontSize={14}
                                        fill="red"
                                        fontStyle="bold"
                                    />
                                </>
                            );
                        })}
                    </>
                )}
            </Layer>
        </Stage>
    )
}