const { admindb, db } = require("../firebase");
const {
  addDoc,
  query,
  doc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
} = require("firebase/firestore");
const { addRandomUsernameWinners } = require("../utils/dbUtil");

const loginSignupUser = async (req, res) => {
  const body = req.query;
  const usersRef = collection(db, "FantasyUser");
  const userData = await getDocs(query(usersRef));

  const userList = userData.docs.map((doc) => doc.data());
  console.log("test3");

  userList.map((user) => {
    if (user.email === body.email) {
      return res.send(user);
    }
  });
  const userObj = {
    email: body.email,
    // uid: body.email,
    firstName: body?.firstName || "",
    lastName: body?.lastName || "",
    profileImage: null,
    phoneNumber: null,
    emailVerified: false,
    wallet: { amount: 0 },
  };
  let ref = await addDoc(collection(db, "FantasyUser"), userObj);
  const data = await updateDoc(ref, { id: ref.id });
  console.log(data);
  return res.send(data);
};

const updateUser = async (userData) => {
  console.log("update userdata", userData);
  const userRef = doc(db, "FantasyUser", userData.id);
  await updateDoc(userRef, userData);
};

const fetchUserService = async (req, res) => {
  const id = req.query?.id;
  console.log(req.query);
  if (id == null || id === undefined) {
    res.status(400).send("Wrong User");
    return;
  }
  let ref = await getDoc(doc(db, "FantasyUser", id));
  if (ref.exists()) {
    console.log(ref.data());
    res.status(200).send(ref.data());
  } else {
    console.log("No such document");
    res.status(400).send("Wrong User");
  }
};

const insertOrderDetails = async (req, res) => {
  const { id, orderId, matchId } = req.query;
  const { playerSelected } = req.body;
  console.log(req.query);
  console.log(req.body);
  if (id == null || id === undefined) {
    res.status(400).send("Wrong User");
    return;
  }
  const ref = doc(db, "FantasyUser", id);
  let docRef = getDoc(ref);
  // console.log(ref.data());
  docRef
    .then(async (doc) => {
      // console.log("doc", doc)
      if (!doc.exists) {
        console.log("Document does not exist");
      } else {
        console.log("Document data:", doc.data());
        const data = doc.data();
        const newTransaction = {
          fantasyOrderId: orderId,
          playerSelected: playerSelected,
          matchId: matchId,
          created_at: new Date(),
        };
        const updatedData = await updateDoc(ref, {
          transactions: [...data.transactions, newTransaction],
        });

        res.status(200).send({
          ...data,
          transactions: [...data.transactions, newTransaction],
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching document:", error);
      res.status(500).send("Error updating document:");
    });
};

const searchUser = async (email, collectionName) => {
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

const fetchAllMatches = async (req, res) => {
  try {
    console.log("document exists");

    const matchesRef = collection(db, "Matches");
    const userData = await getDocs(query(matchesRef));
    const userList = userData.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    console.log("userlist", userList);
    res.status(200).send(userList);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(400).send("Incorrect Match Id");
  }
};

const fetchAllWinners = async (req, res) => {
  const { matchId } = req.query;
  try {
    console.log("document exists", matchId);
    let winnerList = [];

    const matchRef = doc(db, "Matches", matchId);
    const matchDoc = await getDoc(matchRef);
    if (matchDoc.exists()) {
      console.log("match exists", matchDoc.data());
      const matchData = matchDoc.data();
      if (matchData.winners !== undefined && matchData.winners.length > 0) {
        res.status(200).send(matchData.winners);
        return;
      }
      if (
        matchData.topPerformers !== undefined &&
        matchData.topPerformers.length === 3
      ) {
        const usersRef = collection(db, "FantasyUser");
        console.log("test1");
        const userDataList = await getDocs(query(usersRef));
        const userList = userDataList.docs.map((doc) => {
          let userData = doc.data();
          const transactions = userData.transactions.filter(
            (trans) =>
              trans?.matchId === matchId && trans?.status === "captured"
          );
          console.log("test2", transactions);

          transactions.forEach((transaction) => {
            const userWins =
              matchData.topPerformers[0] ===
                transaction.playerSelected[0].name &&
              matchData.topPerformers[1] ===
                transaction.playerSelected[1].name &&
              matchData.topPerformers[2] === transaction.playerSelected[2].name;

            if (userWins) {
              winnerList.push({
                username: userData?.username || userData.email,
                email: userData.email,
                userId: userData.id,
              });
            }
          });
        });
      } else {
        res.status(200).send("Match is in progress");
        return;
      }
    }
    console.log("winnerlist", winnerList);

    const updatedWinners = addRandomUsernameWinners(winnerList);
    await updateDoc(matchRef, { winners: updatedWinners });

    updateWinnersAmount(winnerList);
    console.log("updatedWinners", updatedWinners, winnerList);
    res.status(200).send(updatedWinners);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(400).send("Error fetching document:");
    return;
  }
};

const updateWinnersAmount = (winnerList) => {
  winnerList.map(async (winner) => {
    if (winner.userId === undefined || winner.userId === null) {
      return;
    }
    const userRef = doc(db, "FantasyUser", winner.userId);
    const user = await getDoc(userRef);
    if (user.exists()) {
      const userData = user.data();
      await updateDoc(userRef, {
        ...userData,
        amount:
          parseInt(userData.amount) + parseInt(900000 / winnerList.length),
      });
    }
    return;
  });
};

const addMatch = async (req, res) => {
  const body = req.body;
  try {
    if (body.id === "" || body.id === undefined) {
      let ref = await addDoc(collection(db, "Matches"), body);
      const data = await updateDoc(ref, { id: ref.id });
      console.log(ref);
      return res.send(ref);
    } else {
      const matchRef = doc(db, "Matches", body.id);
      await updateDoc(matchRef, body);
      res.send(matchRef);
    }
  } catch (err) {
    res.send("something went wrong", err);
  }
};

module.exports = {
  updateUser,
  loginSignupUser,
  searchUser,
  fetchUserService,
  insertOrderDetails,
  fetchAllMatches,
  fetchAllWinners,
  addMatch,
};
