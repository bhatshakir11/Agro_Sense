import React, { useRef, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const acceptedFormats = ['.pdf', '.jpg', '.png'];

const mockExtractedData = {
  Nitrogen: 120,
  Phosphorus: 60,
  Potassium: 45,
  pH: 6.5,
  'Organic Carbon': 0.75,
};

export default function SoilUpload({ onExtracted }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const handleFile = (nextFile) => {
    if (!nextFile) return;
    setFile(nextFile);
    setLoading(true);
    setTimeout(() => {
      setExtracted(mockExtractedData);
      setLoading(false);
      onExtracted(mockExtractedData);
    }, 2000);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onInputChange = (event) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', mb: 3 }} component={motion.div} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Box
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={openFilePicker}
        sx={{ border: '2px dashed', borderColor: 'primary.main', p: 4, textAlign: 'center', bgcolor: 'background.default', cursor: 'pointer', mb: 2 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={onInputChange}
          style={{ display: 'none' }}
        />
        <Typography variant="h6" color="primary" mb={1}>Drag & Drop Soil Report</Typography>
        <Typography variant="body2" color="text.secondary">Accepted: .pdf, .jpg, .png</Typography>
        <Button variant="text" sx={{ mt: 1 }}>
          Browse file
        </Button>
        {file && <Typography variant="body2" color="text.secondary" mt={2}>Selected: {file.name}</Typography>}
      </Box>
      {loading && <Box textAlign="center" my={2}><CircularProgress color="success" /><Typography variant="body2" color="text.secondary">Processing report...</Typography></Box>}
      {extracted && <Typography variant="body2" color="success.main">Mock data extracted!</Typography>}
    </Paper>
  );
}
