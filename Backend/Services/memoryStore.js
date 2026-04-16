const memory = {};

const getMemory = (userId) => {
  if(!memory[userId]) {
    memory[userId] = {
      messages: [],
      escalated: false,
      failureCount: 0
    };
  };
  return memory[userId];
};

const addMessages = (userId, role, content) => {
  const memory = getMemory(userId);

  memory.messages.push({
    role,
    content,
  });
};

module.exports = {
  getMemory,
  addMessages
};