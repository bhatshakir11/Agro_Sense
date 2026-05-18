import React, { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Chat, Close, Send, SmartToy } from "@mui/icons-material";
import { askAssistant } from "../../services/assistantService";

const initialMessage = {
  role: "assistant",
  content: "Namaste. Ask me about crop care, leaf disease, pests, fertilizer, or medicine guidance.",
};

const quickPrompts = [
  "My tomato leaves have yellow spots. What should I do?",
  "Which medicine helps fungal leaf disease?",
  "How do I prevent disease after rain?",
];

export default function FarmerAssistantChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const sendMessage = async (content) => {
    const text = String(content || input).trim();

    if (!text || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await askAssistant(nextMessages);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Assistant is unavailable right now."
      );
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <>
      <Tooltip title="Ask AI Assistant">
        <IconButton
          onClick={() => setOpen((value) => !value)}
          sx={{
            position: "fixed",
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: 1300,
            width: 56,
            height: 56,
            bgcolor: "secondary.main",
            color: "#FFFFFF",
            boxShadow: "0 12px 28px rgba(22, 61, 39, 0.22)",
            "&:hover": {
              bgcolor: "secondary.dark",
            },
          }}
          aria-label="Open AI assistant"
        >
          {open ? <Close /> : <Chat />}
        </IconButton>
      </Tooltip>

      {open && (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            right: { xs: 12, md: 24 },
            bottom: { xs: 84, md: 92 },
            zIndex: 1299,
            width: { xs: "calc(100vw - 24px)", sm: 390 },
            height: { xs: 520, sm: 560 },
            maxHeight: "calc(100vh - 112px)",
            border: "1px solid #DDE4D8",
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 18px 42px rgba(15, 23, 42, 0.16)",
          }}
        >
          <Box
            sx={{
              px: 1.6,
              py: 1.3,
              borderBottom: "1px solid #E3EBDD",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.2,
                display: "grid",
                placeItems: "center",
                bgcolor: "#EAF5DD",
                color: "secondary.main",
                flexShrink: 0,
              }}
            >
              <SmartToy fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                AI Farmer Assistant
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Crop disease, medicine, and field care
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close assistant">
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 1.4, flexGrow: 1, overflowY: "auto", bgcolor: "#F8FBF5" }}>
            <Stack spacing={1}>
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <Box
                    key={`${message.role}-${index}`}
                    sx={{
                      alignSelf: isUser ? "flex-end" : "flex-start",
                      maxWidth: "86%",
                      px: 1.2,
                      py: 1,
                      borderRadius: 1.5,
                      bgcolor: isUser ? "secondary.main" : "#FFFFFF",
                      color: isUser ? "#FFFFFF" : "text.primary",
                      border: isUser ? "none" : "1px solid #E2E8DD",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                      {message.content}
                    </Typography>
                  </Box>
                );
              })}

              {loading && (
                <Box sx={{ alignSelf: "flex-start", display: "flex", gap: 1, alignItems: "center" }}>
                  <CircularProgress size={18} color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 0 }}>
              {error}
            </Alert>
          )}

          {messages.length === 1 && (
            <Stack
              direction="row"
              spacing={0.8}
              useFlexGap
              sx={{
                px: 1.2,
                py: 1,
                flexWrap: "wrap",
                borderTop: "1px solid #E3EBDD",
                bgcolor: "#FFFFFF",
              }}
            >
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outlined"
                  size="small"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" },
                    minWidth: 0,
                    textTransform: "none",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    lineHeight: 1.25,
                    whiteSpace: "normal",
                    py: 0.75,
                    "& .MuiButton-startIcon": {
                      mr: 0.5,
                    },
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </Stack>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ p: 1.2, borderTop: "1px solid #E3EBDD" }}>
            <Stack direction="row" spacing={1}>
              <TextField
                inputRef={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about crop disease or medicine..."
                size="small"
                fullWidth
                multiline
                maxRows={3}
              />
              <IconButton
                type="submit"
                disabled={!input.trim() || loading}
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "secondary.main",
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "secondary.dark" },
                  "&.Mui-disabled": { bgcolor: "#DDE4D8" },
                }}
                aria-label="Send message"
              >
                <Send fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
}
