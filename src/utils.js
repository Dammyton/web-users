const uniqueId = (length = 5) => {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace(".", "")
  );
};
const logoutUser = (currentId) => {
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const index = users?.findIndex((user) => user.id === currentId);

  if (index > -1) {
    users.splice(index, 1);
  }

  return localStorage.setItem("users", JSON.stringify(users));
};

const revokeUser = (id) => {
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const index = users.findIndex((user) => user.id === id);

  if (index > -1) {
    users.splice(index, 1);
  }

  return localStorage.setItem("users", JSON.stringify(users));
};

const loginUser = (users) => {
  return localStorage.setItem("users", JSON.stringify(users));
};

const getActiveSessions = (id) => {
  return JSON.parse(localStorage.getItem("users"))?.filter(
    (user) => user?.id !== id
  );
};

function getUserById(id) {
  return JSON.parse(localStorage.getItem("users") || "[]")?.find(
    (user) => user?.id === id && user
  );
}

function getUserByName(name) {
  return JSON.parse(localStorage.getItem("users") || "[]")?.find(
    (user) => user.name.toUpperCase() === name.toUpperCase() && user
  );
}

const changeUserStatus = (id) => {
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const newState = users?.map((obj) =>
    obj.id === Number(id) ? { ...obj, status: "idle" } : obj
  );

  return localStorage.setItem("users", JSON.stringify(newState));
};

export {
  loginUser,
  logoutUser,
  getActiveSessions,
  changeUserStatus,
  revokeUser,
  uniqueId,
  getUserById,
  getUserByName,
};
