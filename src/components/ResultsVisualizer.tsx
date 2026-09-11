import type {ImageResult} from "../api/detectionApi.ts";
import {AnnotatedImage} from "./AnnotatedImage.tsx";
import {Grid} from "@mui/material";
import {VisualizerController} from "./VisualizerController.tsx";
import {useState} from "react";

interface ResultsViewProps {
    results: ImageResult[];
}

export function ResultsVisualizer({results}: ResultsViewProps) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.9);

    function handleIndexChange(index: number) {
        console.log("Navigating to result: ", index);
        setSelectedIndex(index);
    }

    return (
        <Grid className="results-grid">
            <AnnotatedImage result={results[selectedIndex]} maxWidth={Math.min(800, window.innerWidth)}
                            confidenceThreshold={confidenceThreshold}/>
            <VisualizerController
                confidenceThreshold={confidenceThreshold}
                onConfidenceThresholdChange={setConfidenceThreshold}
                currentIndex={selectedIndex}
                totalResults={results.length}
                onIndexChange={handleIndexChange}
            />
        </Grid>
    );
}