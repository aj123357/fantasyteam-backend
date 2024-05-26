const searchPlayer = async (playerName, collectionName) => {
  try {
    console.log("document exists");

    const usersRef = collection(db, collectionName);
    const userData = await getDocs(query(usersRef));
    const userList = userData.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    let flag = null;
    userList.forEach((user) => {
      if (user.email === email) {
        // console.log("document exists", user);
        flag = user;
      }
    });
    return flag;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};
