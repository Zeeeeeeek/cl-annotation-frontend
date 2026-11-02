import { Autocomplete, createFilterOptions, TextField, Typography } from "@mui/material"
import { normalizeLabel } from "../../../utils/labels.ts"

const filter = createFilterOptions<string>()

interface LabelAutocompleteProps {
    value?: string
    onTextChange?: (text: string) => void
    onSelect?: (label: string) => void
    autoFocus?: boolean
    labels: string[]
}

export function LabelAutocomplete({ value, onTextChange, onSelect, autoFocus, labels }: LabelAutocompleteProps) {
    return (
        <Autocomplete
            renderInput={(params) => <TextField {...params} label="Label" autoFocus={autoFocus} />}
            options={labels}
            value={value}
            onInputChange={(_, text) => onTextChange?.(normalizeLabel(text))}
            onChange={(_, newValue) => {
                const label = normalizeLabel(newValue)
                if (label) onSelect?.(label)
            }}
            freeSolo
            disableClearable
            autoSelect
            clearOnBlur
            filterOptions={(options, params) => {
                const filtered = filter(options, params)
                const typedValue = normalizeLabel(params.inputValue)
                if (typedValue !== "" && !options.includes(typedValue)) {
                    filtered.push(typedValue)
                }
                return filtered
            }}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props
                return (
                    <li key={key} {...optionProps}>
                        {labels.includes(option) ? (
                            option
                        ) : (
                            <Typography color="primary">Add “{option}” as a new class</Typography>
                        )}
                    </li>
                )
            }}
        />
    )
}
