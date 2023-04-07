const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const catchAsync = require("./catchAsync");

//extractor accepts leetcode question url as a parameter and returns nicely formatted question of the url ,
const extractor = async (url) => {
  //extracting slug out of url :
  const slug = url.split("/")[4];
  const query = JSON.stringify({
    operationName: "questionData",
    variables: { titleSlug: slug },
    query:
      "query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId title titleSlug content isPaidOnly difficulty likes dislikes isLiked similarQuestions topicTags { name slug } } }",
  });

  const result = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "application/json" },
  });
  const data = await result.json();
  return data.data.question.content;
};
module.exports = extractor;
