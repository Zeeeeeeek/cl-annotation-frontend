import type { ImageResult } from "../api/detectionApi.ts";
import { AnnotatedImage } from "./AnnotatedImage.tsx";

interface ResultsViewProps {
    results: ImageResult[];
}

export function ResultsVisualizer({ results }: ResultsViewProps) {

    return (
    <AnnotatedImage result={results[0]}/>
    );
}