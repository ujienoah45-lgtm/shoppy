// const twilio = require('twilio');

// const T_SID = process.env.TWILIO_SID;
// const T_AUTH =process.env.TWILIO_AUTH;
// const client = twilio(T_SID,T_AUTH);


// const initiateCall = async (response) => {
//   try {
//     const call = await client.calls.create({
//       from: "+12182288740",
//       to: "+2349065854493",
//       url: "http://demo.twilio.com/docs/voice.xml",
//     });
  
//     console.log(call.sid);
    
//   } catch (error) {
//     console.log(error.message);
//   };
// };

const detectCallRequest = (response) => {
  if (typeof response !== "string") {
    return { parsedRes: null };
  }

  const trimmed = response.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return { parsedRes: null };
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && parsed.intent === "call" && typeof parsed.reply === "string") {
      return { parsedRes: parsed };
    }
  } catch (error) {
    return { parsedRes: null };
  }

  return { parsedRes: null };
};






module.exports = detectCallRequest;

// Implicit human request  DONE
// Negative / frustration detection  DONE
// Multiple failed attempts detection  
// Ambigious texts regarding things like (legal, billing and the rest)//  DONE
// Get the response included so you can tell when the LLM is not sure about an answer or when the LLM has no knowledge about what the user is asking about
// const checkCallIntent = (query, response) => {
//   const phrases = [
//     "connect", "agent","customer", "support", "service",
//     "speak", "talk","customer support service", "customer care",
//     "redirect", "customer service",
//     "human", "someone",
//     "help", "help line", "call", "phone"
//   ];

//   const frustrationPhrases = [
//     "not giving", "fraustrating","tired",
//     "this is not", "asked for",
//     "not understand",
//     "dumb",
//     "misunderstanding",
//     "doesn't align",
//     "this is useless"
//   ];

//   const ambigiousPhrases = [
//     "billing","legal","refund","dispute","settlement","reversal","payment",
//   ];

//   const unsurePhrases = [
//     "not sure",
//     "i can't",
//     "i cannot",
//     "seems like",
//     "no information"
//   ];
//   const unsureLLM = unsurePhrases.some(uph => response.includes(uph));
//   const containsFrustrationPhrases = frustrationPhrases.some(fph => query.includes(fph));
//   const containsImplicitPhrase = phrases.some(ph => query.includes(ph));
//   const containsAmbigiousPhrase = ambigiousPhrases.some(aph => query.includes(aph));
//   return { 
//     containsImplicitPhrase,
//     containsFrustrationPhrases,
//     containsAmbigiousPhrase,
//     unsureLLM
//   };
// };
