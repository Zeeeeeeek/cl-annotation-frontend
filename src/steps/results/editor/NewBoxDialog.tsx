import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { COCO_LABELS } from "../../../constants/cocoLabels.ts"
import { useState } from "react"

interface NewBoxDialogProps {
    onCancel: () => void
    onAdd: (label: string) => void
}

export function NewBoxDialog({ onCancel, onAdd }: NewBoxDialogProps) {
    const [label, setLabel] = useState<string | null>(null)

    return (
        <Dialog open onClose={onCancel} fullWidth maxWidth="xs">
            <DialogTitle>New Box</DialogTitle>
            <DialogContent>
                <Autocomplete
                    renderInput={(params) => <TextField {...params} label="Label" autoFocus />}
                    options={COCO_LABELS}
                    value={label}
                    onChange={(_, newValue) => setLabel(newValue)}
                    sx={{ mt: 1 }}
                />
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
