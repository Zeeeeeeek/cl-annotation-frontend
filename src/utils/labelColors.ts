import { parseHslString } from "./hslConversion";

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function deterministicColorForLabel(label: string): string {
    const hue = hashString(label) % 360;
    return `hsl(${hue}, 70%, 45%)`;
}

export function getContrastTextColor(backgroundColor: string): "white" | "black" {
    const { l } = parseHslString(backgroundColor);
    return l > 55 ? "black" : "white";
}