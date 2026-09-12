import {useEffect, useMemo} from "react";
import {Stage, Layer, Image} from 'react-konva';
import type {ImageResult} from "../api/detectionApi.ts";
import useImage from "use-image";
import {DetectionBox} from "./DetectionBox.tsx";
import {acquireObjectUrl, releaseObjectUrl} from "../utils/objectUrlCache.ts";
import Box from "@mui/material/Box";

interface AnnotatedImageProps {
    result: ImageResult;
    confidenceThreshold: number;
    labelColors?: Record<string, string>;
    visibilityStates?: Record<number, boolean>;
    maxWidth?: number;
}

export function AnnotatedImage({
                                   result,
                                   maxWidth = 800,
                                   confidenceThreshold,
                                   visibilityStates,
                                   labelColors
                               }: AnnotatedImageProps) {
    const imageUrl = useMemo(() => acquireObjectUrl(result.file), [result]);

    useEffect(() => {
        return () => releaseObjectUrl(result.file);
    }, [result]);

    const [image] = useImage(imageUrl);

    const scale = image ? Math.min(1, maxWidth / image.width) : 1;
    const stageWidth = image ? image.width * scale : maxWidth;
    const stageHeight = image ? image.height * scale : 0;

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <Stage width={stageWidth} height={stageHeight}>
                <Layer>
                    {image && (
                        <>
                            <Image image={image} width={stageWidth} height={stageHeight}/>
                            {result.detections
                                .map((detection, originalIndex) => ({detection, originalIndex}))
                                .filter(({detection}) => detection.confidence >= confidenceThreshold)
                                .filter(({originalIndex}) => visibilityStates?.[originalIndex] !== false)
                                .map(({detection, originalIndex}) => (
                                    <DetectionBox
                                        key={originalIndex}
                                        detection={detection}
                                        scale={scale}
                                        strokeColor={labelColors ? labelColors[detection.label] : 'red'}
                                        textColor="white"
                                    />
                                ))}
                        </>
                    )}
                </Layer>
            </Stage>
        </Box>
    );
}