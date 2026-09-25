import {Alert, Snackbar} from "@mui/material";
import {useEffect, useState} from "react";
import {checkHealth} from "../api/client.ts";

export function HealthChecker() {
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
    const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
    const [previousIsHealthy, setPreviousIsHealthy] = useState<boolean | null>(null);
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error"; message: string }>({
        severity: "success",
        message: "",
    });

    useEffect(() => {
        const interval = setInterval(async () => {
            const healthy = await checkHealth();
            setIsHealthy(healthy);
        }, 60000);

        (async () => {
            const healthy = await checkHealth();
            setIsHealthy(healthy);
        })();

        return () => clearInterval(interval);
    }, []);

    const isFirstCheck = previousIsHealthy === null;

    if (isHealthy !== previousIsHealthy) {
        const shouldNotify = !(isFirstCheck && isHealthy === true);

        setPreviousIsHealthy(isHealthy);

        if (shouldNotify) {
            if (isHealthy) {
                setAlertInfo({ severity: "success", message: "The server is now working correctly" });
            } else {
                setAlertInfo({ severity: "error", message: "The server is not responding" });
            }
            setShowSnackbar(true);
        }
    }

    return (
        <Snackbar
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowSnackbar(false)}
        >
            <Alert
                severity={alertInfo.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertInfo.message}
            </Alert>
        </Snackbar>
    );
}