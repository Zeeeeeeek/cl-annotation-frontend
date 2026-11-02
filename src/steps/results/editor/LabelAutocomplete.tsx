import { Autocomplete, createFilterOptions, type FilterOptionsState, TextField, Typography } from "@mui/material"
import { normalizeLabel } from "../../../utils/labels.ts"
import type { SyntheticEvent } from "react"

const filter = createFilterOptions<string>()

interface LabelAutocompleteProps {
    value?: string
    onTextChange?: (text: string) => void
    onSelect?: (label: string) => void
    autoFocus?: boolean
    labels: string[]
}

// Adds the typed text as an extra option, so a new class can be created
function filterLabelOptions(options: string[], state: FilterOptionsState<string>): string[] {
    const filtered = filter(options, state)
    const typedLabel = normalizeLabel(state.inputValue)
    if (typedLabel !== "" && !options.includes(typedLabel)) {
        filtered.push(typedLabel)
    }
    return filtered
}

export function LabelAutocomplete({ value, onTextChange, onSelect, autoFocus, labels }: LabelAutocompleteProps) {
    function handleChange(_event: SyntheticEvent, newValue: string) {
        const label = normalizeLabel(newValue)
        if (label) onSelect?.(label)
    }

    return (
        <Autocomplete
            renderInput={(params) => <TextField {...params} label="Label" autoFocus={autoFocus} />}
            options={labels}
            value={value}
            onInputChange={(_, text) => onTextChange?.(normalizeLabel(text))}
            onChange={handleChange}
            freeSolo
            disableClearable
            autoSelect
            clearOnBlur
            filterOptions={filterLabelOptions}
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
