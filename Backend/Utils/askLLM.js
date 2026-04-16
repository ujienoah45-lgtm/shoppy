const axios = require('axios');
const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';
const API_KEY = process.env.HF_TOKEN;
const OPEN_ROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';


const prompt = (context, dummyData, question, memory) => {
  const messages = [
    {
      role: 'system',
      content: `You are a helpful and polite e-commerce assistant i need you to answer the user's question using ONLY the ${JSON.stringify(context)} and the ${JSON.stringify(dummyData)}.Look at the ${memory} and as long as the userId stays the same i want you to keep track of the memory and use it to better 
      answer the subsequent questions. If the ${question} is just a normal conversation or greeting then respond normally and keep the flow natural 
      untill a question about the store or product is asked, When asked for recommedations use the ${JSON.stringify(dummyData)} as a reference. If you cannot find it just say "Sorry we do not have that right now.".
      The prices should be in naira.if the user asks you to perform a task yu can't perform e.g adding products to a cart or placing an order then i want you to say to the user: "i am sorry but right now i cannot do wht you asked" if the ${question} sounds as if the user is fraustrated, angry or asking about legal stuffs like deep refund
      and return policies,advanced billing questions or the user implicitly asks for a call or to speak with an agent then always remember to say say: "MY KNOWLEDGE IS RESTRICTED
      ON THIS MATTER BUT I CAN CONNECT YOU TO A REAL AGENT, SHOULD I DO THAT NOW?" or you can say "SHOULD I CONNECT YOU TO A REAL AGENT RIGHT NOW?" and if the next ${question} 
      is "yes" or "yeah" or anything positive then return a structured data object in a JSON format like this: {"intent": "call", "reply": "string + ${'Please enter your phone number with which you can be contacted.'}"}`
    },
    ...memory.messages,
    {
      role: 'user',
      content: question
    }
  ];

  return messages;
};



const askLLM = async (context, dummyData, question, memory) => {
  const messages = prompt(context, dummyData, question, memory);


  const res = await axios.post(OPEN_ROUTER_URL, {
    model: MODEL,
    messages,
    temperature: 0.65,
    max_token: 380,
    top_p: 0.92,
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 5000
  }, );

  const response = res.data.choices[0].message.content;
  return response;
};

module.exports = askLLM;