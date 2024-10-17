const onlineMembers = new Map();

const addUser = (username, socket) => {
  if (!onlineMembers.has(username)) {
    onlineMembers.set(username, new Set());
  }
  onlineMembers.get(username).add(socket);
};

const removeUser = (username, socket) => {
  if (onlineMembers.has(username)) {
    const userSockets = onlineMembers.get(username);
    userSockets.delete(socket);
    if (userSockets.size === 0) {
      onlineMembers.delete(username);
    }
  }
};

const getUserSockets = (username) => {
  return onlineMembers.get(username);
};

const hasUserSockets = (username) => {
  return onlineMembers.has(username);
};

const deleteUserSockets = (username) => {
  return onlineMembers.delete(username);
};

module.exports = {
  addUser,
  removeUser,
  getUserSockets,
  hasUserSockets,
  deleteUserSockets,
};

// ! redundant
