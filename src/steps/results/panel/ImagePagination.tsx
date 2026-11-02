import { Badge, Pagination, PaginationItem, type PaginationRenderItemParams, Stack } from "@mui/material"
import { PaginationLegend } from "./PaginationLegend.tsx"
import { ModifiedIcon, SentIcon } from "./StatusIcons.tsx"

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
        const isSent = sentImages[index]
        return (
            <Badge
                overlap="circular"
                invisible={!isSent && !editedImages[index]}
                badgeContent={isSent ? <SentIcon /> : <ModifiedIcon />}
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
