import { Card, CardContent, Box, Typography } from "@mui/material";

// icon: an MUI icon element, color: any CSS color, children: the card body
export default function StatCard({ icon, title, color, children, sx }) {
  return (
    <Card sx={{ borderTop: 4, borderColor: color, height: "100%" , ...sx }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5}}>
          <Box
            sx={{
              display: "flex",
              p: 1,
              borderRadius: 1,
              bgcolor: color,
              color: "#fff",
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}
