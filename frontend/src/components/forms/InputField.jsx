import React from "react";
import { TextField } from "@mui/material";

const InputField = ({ label, name, register, errors, ...rest }) => (
  <TextField
    label={label}
    fullWidth
    margin="normal"
    {...register(name)}
    error={!!errors[name]}
    helperText={errors[name]?.message}
    {...rest}
  />
);

export default InputField;
