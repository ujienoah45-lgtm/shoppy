const dummyData = require("../Utils/dummydata.json");

const getKeywords = (name, question) => {
  const normalizedWords = name.toLowerCase().replace(/[^a-z0-9]\s/g , "");
  const normalizedQuestion = question.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const brokenQuestion = normalizedQuestion.split(" ").filter(w => w.length > 3);
  const nameKeyword =  normalizedWords.split(" ").filter(w => w.length > 3);
  return {
    nameKeyword,
    normalizedQuestion,
    brokenQuestion
  }
};



const findProductMatch = (question) => {
  const match = [];

  dummyData.forEach( prod => {
    const { nameKeyword, normalizedQuestion} = getKeywords(prod.name, question);

    const nameMatch = nameKeyword.some(wd => normalizedQuestion.includes(wd));
    const categorySplit = prod.category.slice(0, prod.category.length - 1).toLowerCase();
    const categorySplit2 = prod.category.slice(0, prod.category.length - 2).toLowerCase();
    
    const categoryMatch = normalizedQuestion.includes(prod.category.toLowerCase()) || normalizedQuestion.includes(categorySplit) || normalizedQuestion.includes(categorySplit2);
    
    if(nameMatch && categoryMatch) {
      match.push(prod);
    }
  });
  return match;
};


module.exports = findProductMatch;