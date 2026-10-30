import { useEffect, useState } from "react"
import { UploadStep } from "./steps/upload/UploadStep"
import { ProcessingDialog } from "./steps/processing/ProcessingDialog"
import { ResultsStep } from "./steps/results/ResultsStep"
import { HealthChecker } from "./components/HealthChecker"
import { runDetection } from "./api/runDetection"
import { createImageItem } from "./utils/detections"
import type { ImageItem } from "./types"
import { getClasses } from "./api/client.ts"

type Step = "upload" | "processing" | "results"

export function App() {
    const [step, setStep] = useState<Step>("upload")
    const [images, setImages] = useState<ImageItem[]>([])

    const [labels, setLabels] = useState<string[]>([])

    function updateImage(id: string, changes: Partial<ImageItem>) {
        setImages((prev) => prev.map((image) => (image.id === id ? { ...image, ...changes } : image)))
    }

    function addLabel(newLabel: string) {
        setLabels((prev) => (prev.includes(newLabel) ? prev : [...prev, newLabel]))
    }

    async function loadClasses() {
        try {
            const classes = await getClasses()
            setLabels(classes.map((classInfo) => classInfo.name))
        } catch (error) {
            console.error("Failed to load classes:", error)
        }
    }

    function handleFilesSelected(files: File[]) {
        if (files.length === 0) return

        const newImages = files.map(createImageItem)
        setImages(newImages)
        setStep("processing")
        void runDetection(newImages, updateImage)
        void loadClasses()
    }

    function handleReset() {
        images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
        setImages([])
        setStep("upload")
    }

    useEffect(() => {
        const hasUnsentChanges = images.some((image) => image.edited && !image.sent)
        if (!hasUnsentChanges) return

        function handleBeforeUnload(event: BeforeUnloadEvent) {
            event.preventDefault()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [images])

    return (
        <>
            {step === "upload" && <UploadStep onFilesSelected={handleFilesSelected} />}

            {step === "processing" && (
                <ProcessingDialog images={images} onViewResults={() => setStep("results")} onReset={handleReset} />
            )}

            {step === "results" && (
                <ResultsStep
                    images={images.filter((image) => image.status === "completed")}
                    onImageUpdate={updateImage}
                    onReset={handleReset}
                    labels={labels}
                    onAddLabel={addLabel}
                />
            )}

            <HealthChecker />
        </>
    )
}
