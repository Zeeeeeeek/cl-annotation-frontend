import type { Theme } from "@mui/material"

interface ScrollShadowOptions {
    backgroundColor?: string
    shadowOpacity?: number
    shadowSize?: number
}

export const scrollShadow = (
    theme: Theme,
    {
        backgroundColor = theme.palette.background.paper,
        shadowOpacity = 0.35,
        shadowSize = 20,
    }: ScrollShadowOptions = {},
) => ({
    background: `
        linear-gradient(${backgroundColor} 30%, transparent) center top,
        linear-gradient(transparent, ${backgroundColor} 70%) center bottom,
        radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, ${shadowOpacity}), transparent) center top,
        radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, ${shadowOpacity}), transparent) center bottom`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `100% 40px, 100% 40px, 100% ${shadowSize}px, 100% ${shadowSize}px`,
    backgroundAttachment: "local, local, scroll, scroll",
})
