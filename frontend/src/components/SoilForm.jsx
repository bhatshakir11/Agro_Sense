import React, { useEffect } from "react";
import { Grid, TextField, Typography, Button, Box, Paper, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Science, Timeline, Spa } from "@mui/icons-material";

const soilFields = [
  { name: "Nitrogen", label: "Nitrogen (mg/kg)", min: 0, max: 300, helper: "Typical range: 0-300", icon: <Science fontSize="small" /> },
  { name: "Phosphorus", label: "Phosphorus (mg/kg)", min: 0, max: 150, helper: "Typical range: 0-150", icon: <Science fontSize="small" /> },
  { name: "Potassium", label: "Potassium (mg/kg)", min: 0, max: 200, helper: "Typical range: 0-200", icon: <Science fontSize="small" /> },
  { name: "pH", label: "pH", min: 4, max: 9, helper: "Typical range: 4-9", icon: <Timeline fontSize="small" /> },
  { name: "Organic Carbon", label: "Organic Carbon (%)", min: 0, max: 2, helper: "Typical range: 0-2", icon: <Spa fontSize="small" /> },
];

export default function SoilForm({ defaultValues, onSubmit, loading = false }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Box component={motion.div} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ mb: 1.8 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Soil Parameters
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review the values carefully before generating the final crop recommendation.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1.6}>
          {soilFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <Paper
                elevation={0}
                component={motion.div}
                whileHover={{ y: -4 }}
                sx={{
                  p: 1.4,
                  border: "1px solid #E0E7DA",
                  bgcolor: "#FFFFFF",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #FAFCF8 100%)",
                  height: "100%",
                  borderRadius: "22px",
                  transition: "box-shadow 180ms ease",
                  "&:hover": {
                    boxShadow: "0 14px 30px rgba(24,34,27,0.06)",
                  },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#EDF6E2",
                      color: "secondary.main",
                      flexShrink: 0,
                    }}
                  >
                    {field.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {field.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {field.helper}
                    </Typography>
                  </Box>
                </Stack>

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
                      placeholder={`Enter ${field.name}`}
                      type="number"
                      fullWidth
                      variant="outlined"
                      inputProps={{ min: field.min, max: field.max, step: 0.01 }}
                      helperText={fieldState.error?.message || " "}
                      error={!!fieldState.error}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          bgcolor: "#FFFFFF",
                        },
                      }}
                    />
                  )}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box mt={2.4} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ px: 3, py: 1.1, borderRadius: "999px" }}
          >
            {loading ? "Loading..." : "Get Recommendation"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
