import Button from "@mui/material/Button";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type {ChangeEvent} from "react";

interface InputImageUploadProps {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputImage({handleChange}: InputImageUploadProps) {

    return (
        <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon/>}
        >
            Upload Images
            <input
                type="file"
                hidden
                accept={"image/*"}
                multiple
                onChange={handleChange}
            />
        </Button>
    )
}