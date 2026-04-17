import React, { useRef, useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress, Chip } from "@mui/material";
import { Description, UploadFile } from "@mui/icons-material";
import { motion } from "framer-motion";

const acceptedFormats = [".pdf"];

export default function SoilUpload({ onExtracted }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const handleFile = (nextFile) => {
    if (!nextFile) return;
    setFile(nextFile);
    setExtracted(false);
    setLoading(true);

    Promise.resolve(onExtracted(nextFile))
      .then(() => {
        setExtracted(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onInputChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    handleFile(nextFile);
    event.target.value = "";
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, bgcolor: "background.paper", mb: 3, border: "1px solid #E0E7DA" }}
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={openFilePicker}
        sx={{
          border: "2px dashed",
          borderColor: "primary.main",
          p: 4,
          textAlign: "center",
          bgcolor: "background.default",
          cursor: "pointer",
          mb: 2,
          borderRadius: "28px",
          background: "linear-gradient(180deg, rgba(249,252,247,1) 0%, rgba(244,248,240,1) 100%)",
          transition: "transform 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 18px 38px rgba(24,34,27,0.06)",
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={onInputChange}
          style={{ display: "none" }}
        />
        <Box
          sx={{
            width: 62,
            height: 62,
            borderRadius: "20px",
            display: "grid",
            placeItems: "center",
            bgcolor: "#EAF5DD",
            color: "secondary.main",
            mx: "auto",
            mb: 1.3,
          }}
        >
          <UploadFile />
        </Box>
        <Typography variant="h6" color="primary" mb={1}>
          Drag & Drop Soil Report PDF
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a text-based or scanned soil report for extraction.
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 0.6, color: "text.secondary" }}>
          OCR fallback is used for scanned reports when direct PDF text is not available.
        </Typography>
        <Chip label="Accepted: .pdf" size="small" sx={{ mt: 1.2, mb: 0.8 }} />
        <Button variant="text" sx={{ mt: 1 }}>
          Browse file
        </Button>
        {file && (
          <Box
            sx={{
              mt: 2,
              p: 1.1,
              border: "1px solid #DCE4D4",
              bgcolor: "#FFFFFF",
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Description fontSize="small" color="success" />
            <Typography variant="body2" color="text.secondary">
              Selected: {file.name}
            </Typography>
          </Box>
        )}
      </Box>
      {loading && (
        <Box textAlign="center" my={2}>
          <CircularProgress color="success" />
          <Typography variant="body2" color="text.secondary">
            Analyzing soil report...
          </Typography>
        </Box>
      )}
      {extracted && (
        <Typography variant="body2" color="success.main">
          Soil values extracted from PDF.
        </Typography>
      )}
    </Paper>
  );
}
