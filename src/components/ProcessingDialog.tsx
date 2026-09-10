import Dialog from '@mui/material/Dialog';
import Button from "@mui/material/Button";
import {Chip, DialogContent, DialogTitle, List, ListItem, ListItemText} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import type {ImageResult} from "../api/detectionApi";
import {processImage} from "../api/detectionApi";

interface ProcessingDialogProps {
    open: boolean;
    images: FileList;
    onViewResults: (results: ImageResult[]) => void;
}

export default function ProcessingDialog({open, images, onViewResults}: ProcessingDialogProps) {

    const isMounted = useRef(false);

    const [imageResults, setImageResults] = useState<ImageResult[]>(() => {
        return Array.from(images).map(img => ({
            file: img,
            status: "queued",
            detections: []
        }));
    });

    useEffect(() => {
        if (isMounted.current) return
        isMounted.current = true

        const runProcessing = async () => {
            for (let index = 0; index < imageResults.length; index++) {
                const imageResult = imageResults[index];

                setImageResults(prevResults => {
                    const newResults = [...prevResults];
                    newResults[index] = { ...newResults[index], status: "processing" };
                    return newResults;
                });

                const imageToProcess = { ...imageResult };
                await processImage(imageToProcess);

                setImageResults(prevResults => {
                    const newResults = [...prevResults];
                    newResults[index] = {
                        ...prevResults[index],
                        status: imageToProcess.status,
                        detections: imageToProcess.detections,
                        errorMessage: imageToProcess.errorMessage,
                    };
                    return newResults;
                });
            }
        }

        runProcessing().then()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const [isLoading, setIsLoading] = useState(true)
    const isImagesProcessingDone = imageResults.every(image => image.status === "completed" || image.status === "error");

    useEffect(() => {
        if(isImagesProcessingDone) {
            setIsLoading(false)
        }
    }, [imageResults, isImagesProcessingDone]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "processing":
                return "primary";
            case "completed":
                return "success";
            case "error":
                return "error";
            default:
                return "default";
        }
    }

    const getStatusText = (status: string) => {
        return status[0].toUpperCase() + status.slice(1);
    }

    function removeFileExtension(fileName: string) {
        const lastDotIndex = fileName.lastIndexOf(".")
        if (lastDotIndex <= 0) return fileName
        return fileName.substring(0, lastDotIndex)
    }

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle> Processing images </DialogTitle>
            <DialogContent>
                <List>
                    {imageResults.map((imageResult, index) => (
                        <ListItem divider={index < imageResults.length - 1} key={index}>
                            <ListItemText primary={removeFileExtension(imageResult.file.name)}/>
                            <Chip color= {getStatusColor(imageResult.status)} size="medium" label={getStatusText(imageResult.status)}/>
                        </ListItem>
                    ))}
                </List>
                <Button
                    fullWidth
                    loading = {isLoading}
                    loadingPosition="end"
                    variant="contained"
                    onClick={() => onViewResults(imageResults)}
                >
                    View Results
                </Button>
            </DialogContent>
        </Dialog>
    );

}