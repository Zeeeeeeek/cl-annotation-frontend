const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not set. Copy .env.example to .env and fill it in.")
}

export const API_BASE_URL: string = apiBaseUrl
