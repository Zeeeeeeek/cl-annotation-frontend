import { useState } from "react";
import {deterministicColorForLabel} from "../utils/labelColors";


const STORAGE_KEY = "label-color-overrides";

function loadOverrides(): Record<string, string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function useLabelColors() {
    const [overrides, setOverrides] = useState<Record<string, string>>(loadOverrides);

    function colorForLabel(label: string): string {
        return overrides[label] ?? deterministicColorForLabel(label);
    }

    function setColorForLabel(label: string, color: string) {
        setOverrides(prev => {
            const next = { ...prev, [label]: color };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }

    return { colorForLabel, setColorForLabel };
}