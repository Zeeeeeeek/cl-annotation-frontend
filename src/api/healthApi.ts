const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function isBackendHealthy(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    }
    catch (error) {
        console.error("Health check failed:", error);
        return false;
    }
}