import {Box} from "@mui/material";

export function VisualizerController() {
    return (
        <Box

            sx={{
                borderRadius: 1,
                bgcolor: 'primary.main',
                '&:hover': {
                    bgcolor: 'primary.dark',
                },
            }}
        >
            a
        </Box>
    );
}