let users = [
  { id: 1, forename: "Roy", surname: "Fielding" },
  { id: 2, forename: "Tim", surname: "Berners-Lee" },
  { id: 3, forename: "Jyri", surname: "Kemppainen" },
];

// Map from login username -> array of user ids
const userDataMap = {
  jk: [1], // Roy
  pl: [2, 3], // Tim + Jyri
};

export function getUsers() {
  return users;
}

export function getUserById(id) {
  const numericId = typeof id === "string" ? Number(id) : id;
  return users.find((u) => u.id === numericId) || null;
}

export function createUser(data) {
  const numericId = typeof data.id === "string" ? Number(data.id) : data.id;

  if (getUserById(numericId)) {
    throw new Error("Record already exist");
  }

  const newUser = {
    id: numericId,
    forename: data.forename,
    surname: data.surname,
  };

  users.push(newUser);
  return newUser;
}

export function getUserDataMap(username) {
  return userDataMap[username] || null;
}

export function deleteUserById(id) {
  const numericId = typeof id === "string" ? Number(id) : id;
  const initialLength = users.length;
  users = users.filter((u) => u.id !== numericId);
  return users.length < initialLength;
}
