const eventsMapUtil = {
  top_3_performers: {
    title: "Bet on Top 3 Performers",
    prize_pool_size: 900000,
  },
  top_2_performers: {
    title: "Bet on Top 2 Performers",
    prize_pool_size: 100000,
  },
};

const fetchEventWinner = (performers, transaction) => {
  switch (transaction.eventName) {
    case "top_3_performers":
      return (
        performers["top_3_performers"][0] ===
          transaction.playerSelected[0].name &&
        performers["top_3_performers"][1] ===
          transaction.playerSelected[1].name &&
        performers["top_3_performers"][2] === transaction.playerSelected[2].name
      );
    case "top_2_performers":
      return (
        performers["top_2_performers"][0] ===
          transaction.playerSelected[0].name &&
        performers["top_2_performers"][1] === transaction.playerSelected[1].name
      );
  }
};
module.exports = { fetchEventWinner, eventsMapUtil };
