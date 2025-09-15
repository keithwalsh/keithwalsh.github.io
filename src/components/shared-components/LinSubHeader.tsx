import { Typography } from "@mui/material";

interface Props {
    title: string;
}

export const LinSubHeader: React.FC<Props> = ({ title }) => {
    return (
        <Typography
            variant="h6"
            sx={{
                px: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3 },
                mb: 2
            }}>
            {title}
        </Typography>
    )
}