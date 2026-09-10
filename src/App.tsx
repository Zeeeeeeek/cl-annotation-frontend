import './App.css'
import InputImage from "./components/InputImage.tsx";
import {type ChangeEvent, useState} from "react";
import ProcessingDialog from "./components/ProcessingDialog.tsx";

function App() {
    const [images, setImages] = useState<FileList | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setImages(event.target.files);
            setDialogOpen(true);
        }
    }

    return (
        <>
            {images ? <ProcessingDialog open={dialogOpen} images={images} onViewResults={() => setDialogOpen(false)}/> :
                <InputImage handleChange={handleImagesChange} />}
        </>
    )
}

export default App
