import React, { useState } from "react";
import axios from "axios";

const YourComponent = () => {
  const [translatedText, setTranslatedText] = useState("");
  const apiKey = "sk-VKa9joRd7jw8szImPTxBaji0HV6ioHpW";
  const model = "gpt-3.5-turbo";
  const base_url = "https://api.proxyapi.ru/openai/v1";

  const handleTranslate = () => {
    const textToTranslate = "привет, как тебя зовут?";

    const prompt = `Переведи этот текст на английский: "${textToTranslate}"`;

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

    axios
      .post("https://api.proxyapi.ru/openai/v1/chat/completions", requestData, {
        headers,
      })
      .then((response) => {
        const generatedText = response.data.choices[0].message.content;
        setTranslatedText(generatedText);
        console.log(generatedText);
      })
      .catch((error) => {
        console.error("Ошибка при запросе к OpenAI API:", error.message);
      });
  };

  return (
    <div>
      <button onClick={handleTranslate}>Translate</button>
      <p>Translated Text: {translatedText}</p>
    </div>
  );
};

export default YourComponent;
