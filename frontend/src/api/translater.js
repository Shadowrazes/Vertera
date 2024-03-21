import axios from "axios";

export const Translater = async (textToTranslate, lang) => {
  const apiKey = "sk-VKa9joRd7jw8szImPTxBaji0HV6ioHpW";
  const model = "gpt-3.5-turbo";
  const base_url = "https://api.proxyapi.ru/openai/v1";

  const prompt = `Переведи этот текст без лишних слов на ${lang} язык: ${textToTranslate}`;

  const requestData = {
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await axios.post(
      `${base_url}/chat/completions`,
      requestData,
      { headers }
    );
    const generatedText = response.data.choices[0].message.content;
    // console.log(generatedText);
    return generatedText;
  } catch (error) {
    console.error("Ошибка при запросе к OpenAI API:", error.message);
  }
};
