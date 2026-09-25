import type {BoundingBox, DetectedBox} from "../types.ts";
import {Group, Rect, Text} from "react-konva";

interface DetectionBoxProps {
    detection: DetectedBox;
    scale: number;
    textColor?: string;
    strokeColor?: string;
}

function scaleBox(box: BoundingBox, scale: number): BoundingBox {
    return {
        x: box.x * scale,
        y: box.y * scale,
        width: box.width * scale,
        height: box.height * scale,
    };
}

export function DetectionBox({detection, scale, textColor, strokeColor}: DetectionBoxProps) {
    const box = scaleBox(detection.box, scale);
    const labelText = `${detection.label} ${Math.trunc(detection.confidence * 100)}%`;

    const labelFontSize = 14;
    const labelPaddingX = 4;
    const labelPaddingY = 2;
    const labelWidth = labelText.length * (labelFontSize * 0.6) + labelPaddingX * 2;
    const labelHeight = labelFontSize + labelPaddingY * 2;

    return (
        <Group>
            <Rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fillEnabled={false}
                stroke={strokeColor || "red"}
                strokeWidth={3}
                shadowBlur={10}
            />
            <Rect
                x={box.x + 4}
                y={box.y + 4}
                width={labelWidth}
                height={labelHeight}
                fill={strokeColor || "red"}
            />
            <Text
                x={box.x + 4 + labelPaddingX}
                y={box.y + 4 + labelPaddingY}
                text={labelText}
                fontSize={labelFontSize}
                fill={textColor || "white"}
                fontStyle="bold"
            />
        </Group>
    );
}