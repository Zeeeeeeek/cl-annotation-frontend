import type {ImageResult} from "../api/detectionApi.ts";

interface ResultsViewProps {
    results: ImageResult[];
}

export function ResultsVisualizer({results}: ResultsViewProps) {
    console.log(results)

    return (
        <>a</>
    );
}