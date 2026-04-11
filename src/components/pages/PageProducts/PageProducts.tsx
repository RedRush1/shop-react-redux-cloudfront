import Products from "~/components/pages/PageProducts/components/Products";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

export default function PageProducts() {
  return (
    <Box py={3}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          🖥️ TechZone Store
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your one-stop shop for Gadgets, Smartphones &amp; PC Parts
        </Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          gap={1}
          flexWrap="wrap"
        >
          <Chip label="📱 Smartphones" color="primary" variant="outlined" />
          <Chip label="🖥️ PC Parts" color="primary" variant="outlined" />
          <Chip label="🎧 Gadgets" color="primary" variant="outlined" />
        </Box>
        <Typography
          variant="caption"
          color="text.disabled"
          display="block"
          mt={2}
        >
          Crafted by <strong>Vasyl Rebresh</strong>
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Products />
    </Box>
  );
}
