import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material"
import {useState} from "react"
import {LabelAutocomplete} from "./LabelAutocomplete.tsx"

interface NewBoxDialogProps {
    onCancel: () => void
    onAdd: (label: string) => void
    labels: string[]
}

export function NewBoxDialog({onCancel, onAdd, labels}: NewBoxDialogProps) {
    const [label, setLabel] = useState<string | null>(null)

    return (
        <Dialog open onClose={onCancel} fullWidth maxWidth="xs">
            <DialogTitle>New Box</DialogTitle>
            <DialogContent>
                <Box sx={{mt: 1}}>
                    <LabelAutocomplete autoFocus onTextChange={(text) => setLabel(text || null)} labels={labels}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={() => label && onAdd(label)} variant="contained" color="primary" disabled={!label}>
                    Add box
                </Button>
            </DialogActions>
        </Dialog>
    )
}
