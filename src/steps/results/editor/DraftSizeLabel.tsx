import { Group, Label, Text, Tag } from "react-konva"

interface DraftSizeLabelProps {
    draftBox: { x: number; y: number; width: number; height: number }
    scale: number
}

export function DraftSizeLabel({ draftBox, scale }: DraftSizeLabelProps) {
    const text = `${Math.round(draftBox.width)} × ${Math.round(draftBox.height)} px`
    const position = {
        x: draftBox.x,
        y: draftBox.y + draftBox.height,
    }

    return (
        <Group position={position} scaleX={1 / scale} scaleY={1 / scale}>
            <Label x={0} y={4}>
                <Tag fill="black" cornerRadius={4} />
                <Text text={text} fontSize={14} padding={4} fill="white" />
            </Label>
        </Group>
    )
}
