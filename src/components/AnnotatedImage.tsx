import { useEffect, useMemo } from "react";
import { Stage, Layer, Image } from 'react-konva';
import type { ImageResult } from "../api/detectionApi.ts";
import useImage from "use-image";
import { DetectionBox } from "./DetectionBox.tsx";
import { acquireObjectUrl, releaseObjectUrl } from "../utils/objectUrlCache.ts";

interface AnnotatedImageProps {
    result: ImageResult;
    confidenceThreshold: number;
    maxWidth?: number;
}

export function AnnotatedImage({ result, maxWidth = 800 , confidenceThreshold}: AnnotatedImageProps) {
    const imageUrl = useMemo(() => acquireObjectUrl(result.file), [result]);

    useEffect(() => {
        return () => releaseObjectUrl(result.file);
    }, [result]);

    const [image] = useImage(imageUrl);

    const scale = image ? Math.min(1, maxWidth / image.width) : 1;
    const stageWidth = image ? image.width * scale : maxWidth;
    const stageHeight = image ? image.height * scale : 0;

    return (
        <Stage width={stageWidth} height={stageHeight}>
            <Layer>
                {image && (
                    <>
                        <Image image={image} width={stageWidth} height={stageHeight} />
                        {result.detections
                            .filter(detection => detection.confidence >= confidenceThreshold)
                            .map((detection, index) => (
                            <DetectionBox
                                key={index}
                                detection={detection}
                                scale={scale}
                                strokeColor="red"
                                textColor="white"
                            />
                        ))}
                    </>
                )}
            </Layer>
        </Stage>
    );
}