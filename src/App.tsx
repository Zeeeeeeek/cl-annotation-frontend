import { useState } from "react"
import { UploadStep } from "./steps/upload/UploadStep"
import { ProcessingDialog } from "./steps/processing/ProcessingDialog"
import { ResultsStep } from "./steps/results/ResultsStep"
import { HealthChecker } from "./components/HealthChecker"
import { runDetection } from "./api/runDetection"
import { createImageItem } from "./utils/detections"
import type { ImageItem } from "./types"

type Step = "upload" | "processing" | "results"

export function App() {
    const [step, setStep] = useState<Step>("upload")
    const [images, setImages] = useState<ImageItem[]>([])

    function updateImage(id: string, changes: Partial<ImageItem>) {
        setImages(prev => prev.map(image => (image.id === id ? { ...image, ...changes } : image)))
    }

    function handleFilesSelected(files: File[]) {
        if (files.length === 0) return

        const newImages = files.map(createImageItem)
        setImages(newImages)
        setStep("processing")
        void runDetection(newImages, updateImage)
    }

    function handleReset() {
        images.forEach(image => URL.revokeObjectURL(image.previewUrl))
        setImages([])
        setStep("upload")
    }

    return (
        <>
            {step === "upload" && <UploadStep onFilesSelected={handleFilesSelected} />}

            {step === "processing" && (
                <ProcessingDialog images={images} onViewResults={() => setStep("results")} />
            )}

            {step === "results" && (
                <ResultsStep images={images} onImageUpdate={updateImage} onReset={handleReset} />
            )}

            <HealthChecker />
        </>
    )
}