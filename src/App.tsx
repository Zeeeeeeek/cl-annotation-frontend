import './App.css'
import {type ChangeEvent, useState} from "react";
import ProcessingDialog from "./components/ProcessingDialog.tsx";
import {ResultsVisualizer} from "./components/ResultsVisualizer.tsx";
import type { ImageResult } from "./api/detectionApi";
import {HealthChecker} from "./components/HealthChecker.tsx";
import { ImageLoader } from "./components/imageLoader/ImageLoader.tsx";

type AppPhase =
    | { step: "input" }
    | { step: "processing"; images: FileList }
    | { step: "results"; results: ImageResult[] }

function App() {
    const [phase, setPhase] = useState<AppPhase>({ step: "input" });

    function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setPhase({ step: "processing", images: event.target.files });
        }
    }

    function handleViewResults(imageResults: ImageResult[]) {
        setPhase({ step: "results", results: imageResults });
    }

    return (
        <>
            {phase.step === "input" && (
                <ImageLoader handleChange={handleImagesChange} />
            )}

            {phase.step === "processing" && (
                <ProcessingDialog
                    open={true}
                    images={phase.images}
                    onViewResults={handleViewResults}
                />
            )}

            {phase.step === "results" && (
                <ResultsVisualizer results={phase.results} />
            )}

            <HealthChecker />
        </>
    )
}

export default App