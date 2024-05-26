const {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  query,
} = require("firebase/firestore");
const { admindb, db } = require("../firebase");

const updatePlayers = async (req, res) => {
  const playerDetails = req.body;
  console.log(playerDetails);
  try {
    if (playerDetails.length === 0) {
      res.status(200).send("No players");
      return;
    }
    console.log("test0");

    const playersRef = collection(db, "Players");
    console.log("test1");

    const playerData = await getDocs(query(playersRef));
    console.log("test2");
    const playerList = playerData.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    playerDetails.map(async (player) => {
      await updatePlayerDB(player, playerList);
    });
    res.status(200).send(playerDetails);
  } catch (err) {
    res.status(500).send("Error in updating");
  }
};

const updatePlayerDB = async (playerReq, playerList) => {
  try {
    let flag = false;
    let playerFound = "";
    console.log("playerList", playerList);
    for (let player of playerList) {
      console.log("player bhaiisaab", player);
      if (player.name == playerReq.name) {
        console.log("FOUNDDDD", player);
        flag = true;
        playerFound = player;
        break;
      }
    }
    if (flag) {
      console.log("lets see", playerReq);
      //   const playerRef = doc(db, "Players", playerFound.id);
      await updateDoc(
        doc(db, "Players", playerFound.id),
        {
          ...playerFound,
          id: playerFound.id,
          teams: playerReq.teams.map((team) => {
            return { teamName: team, isPlaying: true, teamPhoto: "" };
          }),
        }
        // createTeamsObject(true, playerReq, playerFound)
      );
    } else {
      let ref = await addDoc(collection(db, "Players"), {
        ...playerReq,
        teams: playerReq.teams.map((team) => {
          return { teamName: team, isPlaying: true, teamPhoto: "" };
        }),
      });
      await updateDoc(ref, {
        id: ref.id,
      });
    }
  } catch (err) {
    console.error("Finding players error", err);
  }
};

const fetchMatchPlayers = async (req, res) => {
  try {
    const { teams } = req.query;
    console.log("jindal", teams, req.params, req.body);
    const team1 = teams[0];
    const team2 = teams[1];
    const result = {
      [team1]: { teamPlayers: [] },
      [team2]: { teamPlayers: [] },
    };

    const playersRef = collection(db, "Players");
    console.log("test1");

    const playerData = await getDocs(query(playersRef));
    console.log("test2");
    const playerList = playerData.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    playerList.map((player) => {
      const playerTeams = player.teams.map((plTeam) => plTeam.teamName);
      if (playerTeams.includes(team1)) {
        result[team1]["teamPlayers"].push(player);
      }
      if (playerTeams.includes(team2)) {
        result[team2]["teamPlayers"].push(player);
      }
    });
    console.log("jindal result", result);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { updatePlayers, fetchMatchPlayers };
