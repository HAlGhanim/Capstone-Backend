const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// console.log(openai);
// const user = {
//   interests: ["readings", "physics", "cooking", "education"],
// };

// const events = [
//   {
//     id: "a3f9z81j9znf2z5j4k6l",
//     name: "Culinary World Tour",
//     description:
//       "Discover cuisines from different countries in this immersive workshop.",
//     tags: ["cooking", "culture", "global"],
//     //date: "10-08-2023",
//   },
//   {
//     id: "b4g0x72k0yog3a6m5n7o",
//     name: "Tech in Literature",
//     description:
//       "Discussion on the portrayal of technology in classic and modern literature.",
//     tags: ["reading", "technology", "literature"],
//     date: "15-08-2023",
//   },
//   {
//     id: "c5h1y93l1zpg4b7n6o8p",
//     name: "Mysteries of the Deep Sea",
//     description:
//       "A visual journey to the deepest parts of our oceans and the creatures that inhabit them.",
//     tags: ["science", "oceanography", "exploration"],
//     date: "20-08-2023",
//   },
//   {
//     id: "d6i2z04m2aqh5c8p7q9r",
//     name: "Origami Mastery Workshop",
//     description:
//       "Learn the ancient art of origami and create intricate paper designs.",
//     tags: ["craft", "workshop", "art", "science"],
//     date: "25-08-2023",
//   },
//   {
//     id: "e7j3a15n3brj6d9s8t0u",
//     name: "Debunking Myths in History",
//     description:
//       "A talk series challenging and discussing common historical misconceptions.",
//     tags: ["history", "discussion", "education"],
//     date: "30-08-2023",
//   },
//   {
//     id: "e001",
//     name: "Mars Exploration",
//     description:
//       "Discussion on the recent discoveries on Mars by the latest rovers",
//     tags: ["science", "space"],
//     date: "10-08-2023",
//   },
//   {
//     id: "e002",
//     name: "Culinary Innovations",
//     description: "Explore the latest trends and experiments in cooking",
//     tags: ["cooking", "food"],
//     date: "15-08-2023",
//   },
//   {
//     id: "e003",
//     name: "Brave New World group reading",
//     description: "Group reading of Aldous Huxley's famous novel",
//     tags: ["reading", "dystopia"],
//     date: "20-08-2023",
//   },
//   {
//     id: "e004",
//     name: "Quantum Mechanics Seminar",
//     description: "Delving into the world of quantum physics with top experts",
//     tags: ["science", "physics"],
//     date: "25-08-2023",
//   },
//   {
//     id: "e005",
//     name: "The Art of Baking",
//     description: "Learn advanced baking techniques with renowned chefs",
//     tags: ["baking"],
//     date: "30-08-2023",
//   },
//   {
//     id: "e006",
//     name: "Time-travel in Movies",
//     description: "Discussing the portrayal of time-travel in popular films",
//     tags: ["movies"],
//     date: "5-09-2023",
//   },
//   {
//     id: "e007",
//     name: "fun time",
//     description: "fun Discussing the portrayal of time-travel in popular films",
//     tags: ["meet-up"],
//     date: "5-09-2023",
//   },
// ];
//

const AI = async (user, events) => {
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `based on the events tags ${JSON.stringify(
          events
        )}, find what this user with interests (as tags) ${JSON.stringify(
          user
        )}, could like from list based on his interests ONLY. return mix of 5 only suggested events ids only in an array and the key is events. Do not include any explanations, only provide a RFC8259 compliant JSON response without deviation.`,
      },
    ],
  });
  // console.log("here is the event json stringify", JSON.stringify(events));
  if (!configuration.apiKey) {
    console.log("heree is the error config");
  }
  const generatedText = chat_completion.data.choices[0].message;
  // console.log(chat_completion.data.choices[0].message);
  const res = JSON.parse(generatedText.content);
  // console.log("herre", res);
  return res;
};
module.exports = AI;
