import React, { useEffect } from 'react';
import { Grid, TextField, Paper, Typography, Button, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';

const soilFields = [
  { name: 'Nitrogen', label: 'Nitrogen (mg/kg)', min: 0, max: 300, helper: 'Typical range: 0-300' },
  { name: 'Phosphorus', label: 'Phosphorus (mg/kg)', min: 0, max: 150, helper: 'Typical range: 0-150' },
  { name: 'Potassium', label: 'Potassium (mg/kg)', min: 0, max: 200, helper: 'Typical range: 0-200' },
  { name: 'pH', label: 'pH', min: 4, max: 9, helper: 'Typical range: 4-9' },
  { name: 'Organic Carbon', label: 'Organic Carbon (%)', min: 0, max: 2, helper: 'Typical range: 0-2' },
];

export default function SoilForm({ defaultValues, onSubmit, loading = false }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }} component={motion.div} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Typography variant="h6" mb={2}>Soil Parameters</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {soilFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <Controller
                name={field.name}
                control={control}
                rules={{
                  required: `${field.label} required`,
                  min: { value: field.min, message: `Minimum value is ${field.min}` },
                  max: { value: field.max, message: `Maximum value is ${field.max}` },
                }}
                render={({ field: controllerField, fieldState }) => (
                  <TextField
                    {...controllerField}
                    label={field.label}
                    type="number"
                    fullWidth
                    variant="outlined"
                    inputProps={{ min: field.min, max: field.max, step: 0.01 }}
                    helperText={fieldState.error?.message || field.helper}
                    error={!!fieldState.error}
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? 'Loading...' : 'Get Recommendation'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
