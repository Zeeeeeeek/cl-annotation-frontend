import { Alert, Snackbar } from "@mui/material"
import { useEffect, useState } from "react"
import { checkHealth } from "../api/client"

export function HealthChecker() {
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error"; message: string }>({
        severity: "success",
        message: "",
    })

    useEffect(() => {
        let previousIsHealthy: boolean | null = null

        async function refreshHealth() {
            const isHealthy = await checkHealth()
            const isFirstCheck = previousIsHealthy === null
            const hasChanged = isHealthy !== previousIsHealthy
            previousIsHealthy = isHealthy

            if (!hasChanged || (isFirstCheck && isHealthy)) return

            setAlertInfo(
                isHealthy
                    ? { severity: "success", message: "The server is now working correctly" }
                    : { severity: "error", message: "The server is not responding" },
            )
            setShowSnackbar(true)
        }

        void refreshHealth()
        const interval = setInterval(refreshHealth, 60000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
            <Alert severity={alertInfo.severity} variant="filled" sx={{ width: "100%" }}>
                {alertInfo.message}
            </Alert>
        </Snackbar>
    )
}
