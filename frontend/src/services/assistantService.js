import api from "./api";

export async function askAssistant(messages) {
  const response = await api.post(
    "/assistant-chat",
    { messages },
    {
      timeout: 120000,
    }
  );

  return response.data;
}
