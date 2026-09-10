import './App.css'
import InputImage from "./components/InputImage.tsx";
import {type ChangeEvent, useState} from "react";
import ProcessingDialog from "./components/ProcessingDialog.tsx";
import {ResultsVisualizer} from "./components/ResultsVisualizer.tsx";
import type { ImageResult } from "./api/detectionApi";

function App() {
    const [images, setImages] = useState<FileList | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [results, setResults] = useState<ImageResult[] | null>(null);

    function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setImages(event.target.files);
            setDialogOpen(true);
        }
    }

    function handleViewResults(imageResults: ImageResult[]) {
        setResults(imageResults);
        setDialogOpen(false);
    }

    if (results) {
        return <ResultsVisualizer results={results} />;
    }

    return (
        <>
            {images ? <ProcessingDialog open={dialogOpen} images={images} onViewResults={handleViewResults}/> :
                <InputImage handleChange={handleImagesChange} />}
        </>
    )
}

export default App