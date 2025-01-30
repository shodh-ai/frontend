import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function LinearDeterminate() {
  return (
    <Box sx={{ maxWidth: "200px", width: "100%", height: "10px" }}>
      <LinearProgress
        variant="determinate"
        value={20}
        sx={{
          height: "10px",
          borderRadius: "12px",
          backgroundColor: "#717171",
          "& .css-l16vtb-MuiLinearProgress-bar1": {
            backgroundColor: "#C7CCF8",
            borderRadius: "12px",
          },
        }}
      />
    </Box>
  );
}
