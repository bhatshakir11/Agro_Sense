import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, LocalFlorist } from "@mui/icons-material";
import Card from "../../components/common/Card";
import PageHero from "../../components/common/PageHero";
import { analyzeLeafDisease } from "../../services/diseaseService";
import { useAppData } from "../../context/AppDataContext";

function imageFileToOptimizedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxDimension = 1400;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        if (!context) {
          reject(new Error("Unable to process the selected image."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.onerror = () => reject(new Error("Unable to read the selected image."));
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const DiseaseDetectionPage = () => {
  const { updateDiseaseData } = useAppData();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const imageData = await imageFileToOptimizedDataUrl(file);
      const analysis = await analyzeLeafDisease({
        imageData,
        cropHint: "",
      });
      setResult(analysis);
      updateDiseaseData({
        analysis,
      });
    } catch (requestError) {
      const fallbackMessage =
        requestError.code === "ECONNABORTED"
          ? "Disease analysis is taking too long. Please try again with a clearer, smaller leaf image."
          : "Unable to analyze the uploaded leaf image.";

      setError(
        requestError.response?.data?.message || requestError.message || fallbackMessage
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box>
      <PageHero
        eyebrow="Plant Health AI"
        title="Disease Detection"
        subtitle="Upload a diseased leaf photo to run backend image analysis, estimate likely disease confidence, and review practical treatment guidance."
        chips={["Backend Analysis", "Confidence Scoring", "Medication Guidance"]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        This tool gives decision support, not lab-confirmed diagnosis. Very high confidence is only shown when the image evidence is strong.
      </Alert>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card title="Upload Crop Image" subtitle="Capture a close leaf image in natural light for better prediction.">
            <Stack spacing={1.4}>
              <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ alignSelf: "flex-start" }}>
                Upload Leaf Image
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
            </Stack>

            <Box
              sx={{
                border: "1px dashed #9AB893",
                p: 1,
                bgcolor: "#F8FBF5",
                minHeight: 260,
                display: "grid",
                placeItems: "center",
                mt: 1.8,
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded crop leaf"
                  style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography variant="h6" sx={{ mb: 0.8 }}>
                    Upload a diseased leaf photo to begin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A sharp image with one clear affected leaf works best.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            title="Detection Summary"
            subtitle="Backend AI identifies the most likely disease and urgency level."
            rightNode={
              result ? (
                <Chip
                  icon={<LocalFlorist />}
                  label={`Model confidence ${result.confidence}%`}
                  color={result.confidence >= 90 ? "success" : "warning"}
                />
              ) : null
            }
          >
            {loading ? (
              <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}>
                <CircularProgress color="success" />
              </Box>
            ) : result ? (
              <Stack spacing={1.2}>
                <Box sx={{ border: "1px solid #DDE3D8", p: 1.3, bgcolor: "#FFFFFF" }}>
                  <Typography variant="body2" color="text.secondary">
                    Likely crop
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 0.8 }}>
                    {result.crop}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.6 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {result.likelyDisease}
                    </Typography>
                    <Chip size="small" label={result.severity} color={result.severity === "high" ? "error" : result.severity === "medium" ? "warning" : "success"} />
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={result.confidence}
                    color={result.confidence >= 90 ? "success" : "warning"}
                    sx={{ height: 8, mb: 0.8 }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    {result.diagnosisSummary}
                  </Typography>
                </Box>

                {result.reviewRecommended && (
                  <Alert severity="warning">
                    The image should be reviewed by an agronomist or plant expert before final treatment.
                  </Alert>
                )}

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.7 }}>
                    Visible symptoms
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {result.visibleSymptoms.map((item) => (
                      <Chip key={item} label={item} variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Upload a leaf photo to run disease analysis.
              </Typography>
            )}
          </Card>

          <Card title="Medication Recommendation">
            {loading ? (
              <Box sx={{ minHeight: 120, display: "grid", placeItems: "center" }}>
                <CircularProgress color="success" size={28} />
              </Box>
            ) : result ? (
              <Stack spacing={1}>
                {result.medications.map((item) => (
                  <Box key={`${item.name}-${item.usage}`} sx={{ border: "1px solid #DDE3D8", p: 1.2, bgcolor: "#FFFFFF" }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.4 }}>
                      {item.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.purpose}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {item.usage}
                    </Typography>
                  </Box>
                ))}

                {result.organicSupport.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.7 }}>
                      Supportive care
                    </Typography>
                    <Stack spacing={0.6}>
                      {result.organicSupport.map((item) => (
                        <Typography key={item} variant="body2" color="text.secondary">
                          {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}

                {result.immediateActions.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.7 }}>
                      Immediate actions
                    </Typography>
                    <Stack spacing={0.6}>
                      {result.immediateActions.map((item) => (
                        <Typography key={item} variant="body2" color="text.secondary">
                          {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Alert severity="info">{result.notes}</Alert>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Medication guidance will appear after image analysis completes.
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DiseaseDetectionPage;
