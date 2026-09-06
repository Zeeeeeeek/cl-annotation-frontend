import Dialog from '@mui/material/Dialog';
import Button from "@mui/material/Button";

interface ProcessingDialogProps {
    open: boolean;
    images: FileList;
    onViewResults: () => void;
}

export default function ProcessingDialog({open, images, onViewResults}: ProcessingDialogProps) {
    return (
        <Dialog open={open}>
            <div style={{padding: '20px', textAlign: 'center'}}>
                <h2>Processing {images.length} images...</h2>
                <p>Please wait while we process your images.</p>
                <Button variant="contained" onClick={onViewResults}>View Results</Button>
            </div>
        </Dialog>
    );

}