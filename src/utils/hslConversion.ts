import type { HslColor } from "react-colorful";

export function parseHslString(hslString: string): HslColor {
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return { h: 0, s: 70, l: 45 };
    const [, h, s, l] = match;
    return { h: Number(h), s: Number(s), l: Number(l) };
}

export function toHslString(color: HslColor): string {
    return `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`;
}