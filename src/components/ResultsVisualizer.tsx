import type {ImageResult} from "../api/detectionApi.ts";
import {AnnotatedImage} from "./AnnotatedImage.tsx";
import {Grid} from "@mui/material";
import {VisualizerController} from "./VisualizerController.tsx";

interface ResultsViewProps {
    results: ImageResult[];
}

export function ResultsVisualizer({results}: ResultsViewProps) {

    return (
        <Grid className="results-grid">
            <AnnotatedImage result={results[0]} maxWidth={Math.min(800, window.innerWidth)}/>
            <VisualizerController/>
        </Grid>
    );
}