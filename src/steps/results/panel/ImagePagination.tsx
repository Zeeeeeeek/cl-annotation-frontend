import { Badge, Pagination, PaginationItem, type PaginationRenderItemParams, Stack } from "@mui/material"
import { PaginationLegend } from "./PaginationLegend.tsx"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CircleIcon from "@mui/icons-material/Circle"

interface ImagePaginationProps {
    currentIndex: number
    totalResults: number
    onIndexChange: (index: number) => void
    editedImages: boolean[]
    sentImages: boolean[]
}

export function ImagePagination({
    currentIndex,
    totalResults,
    onIndexChange,
    editedImages,
    sentImages,
}: ImagePaginationProps) {
    function renderPageItem(item: PaginationRenderItemParams) {
        if (item.type !== "page" || item.page === null) return <PaginationItem {...item} />

        const index = item.page - 1
        if (sentImages[index]) {
            return (
                <Badge
                    overlap="circular"
                    badgeContent={<CheckCircleIcon color="success" sx={{ fontSize: "0.875rem" }} />}
                >
                    <PaginationItem {...item} />
                </Badge>
            )
        }
        return (
            <Badge
                overlap="circular"
                invisible={!editedImages[index]}
                badgeContent={<CircleIcon color="warning" sx={{ fontSize: "0.875rem" }} />}
            >
                <PaginationItem {...item} />
            </Badge>
        )
    }

    return (
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={2}>
            <Pagination
                count={totalResults}
                page={currentIndex + 1}
                onChange={(_, page) => onIndexChange(page - 1)}
                sx={{ display: "flex", justifyContent: "center", flex: 1 }}
                renderItem={renderPageItem}
            />
            <PaginationLegend />
        </Stack>
    )
}
