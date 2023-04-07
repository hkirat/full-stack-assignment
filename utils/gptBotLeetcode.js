require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const askQuestion = async (question) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `
         ${question}+
         ###
        `,
    max_tokens: 64,
    temperature: 0,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\n"],
  });
  return response.data.choices[0].text;
};

module.exports = askQuestion;
