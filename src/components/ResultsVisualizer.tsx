import type {ImageResult} from "../api/detectionApi.ts";
import {AnnotatedImage} from "./AnnotatedImage.tsx";
import {Grid} from "@mui/material";
import {VisualizerController} from "./controller/VisualizerController.tsx";
import {useState} from "react";
import {useLabelColors} from "../hooks/useLabelColors.ts";

interface ResultsViewProps {
    results: ImageResult[];
}

function createInitialVisibility(result: ImageResult): Record<number, boolean> {
    return Object.fromEntries(result.detections.map((_, index) => [index, true]));
}

export function ResultsVisualizer({results}: ResultsViewProps) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.9);
    const { colorForLabel, setColorForLabel } = useLabelColors();
    const [visibilityStates, setVisibilityStates] = useState<Record<number, Record<number, boolean>>>(() => ({
        0: createInitialVisibility(results[0]),
    }));

    function onToggleVisibility(boxIndex: number) {
        setVisibilityStates(prevStates => {
            const currentImageStates = prevStates[selectedIndex] ?? {};
            const currentVisibility = currentImageStates[boxIndex] ?? true;
            return {
                ...prevStates,
                [selectedIndex]: {
                    ...currentImageStates,
                    [boxIndex]: !currentVisibility,
                },
            };
        });
    }

    function handleIndexChange(newIndex: number) {
        setVisibilityStates(prev => {
            if (prev[newIndex]) return prev;
            return { ...prev, [newIndex]: createInitialVisibility(results[newIndex]) };
        });
        setSelectedIndex(newIndex);
    }

    const currentDetections = results[selectedIndex].detections;
    const labelColors = Object.fromEntries(
        currentDetections.map(d => [d.label, colorForLabel(d.label)])
    );

    return (
        <Grid className="results-grid">
            <AnnotatedImage result={results[selectedIndex]} maxWidth={Math.min(800, window.innerWidth)}
                            confidenceThreshold={confidenceThreshold}
                            labelColors={labelColors}
                            visibilityStates={visibilityStates[selectedIndex]}
            />
            <VisualizerController
                confidenceThreshold={confidenceThreshold}
                onConfidenceThresholdChange={setConfidenceThreshold}
                currentIndex={selectedIndex}
                totalResults={results.length}
                onIndexChange={handleIndexChange}
                detections={currentDetections}
                onToggleVisibility={onToggleVisibility}
                colorForLabel={colorForLabel}
                setColorForLabel={setColorForLabel}
                visibilityStates={visibilityStates[selectedIndex]}
            />
        </Grid>
    );
}