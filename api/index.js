const express = require("express");
const dotEnv = require("dotenv");
const cors = require("cors");
const { placeBet, orderPaid } = require("../service/paymentService");
const {
  LoginUserService,
  passwordResetEmail,
} = require("../service/authService");
const {
  fetchAllMatches,
  fetchUserService,
  insertOrderDetails,
  addMatch,
  fetchAllWinners,
} = require("../service/userService");

dotEnv.config();

const app = express();

const PORT = process.env.PORT || 5008;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log("server started at PORT:", PORT));

app.get("/", (req, res) => res.send("Express on Vercel"));

// app.get("/v1/payment_callback", paymentCallBack);
app.get("/v1/place_bet", placeBet);
app.post("/v1/order_paid", orderPaid);
app.post("/v1/insertOrderId", insertOrderDetails);

app.get("/v1/login", LoginUserService);
app.get("/v1/passwordResetEmail", passwordResetEmail);
app.get("/v1/fetchUser", fetchUserService);
app.get("/v1/fetchAllMatches", fetchAllMatches);
app.get("/v1/fetchAllWinners", fetchAllWinners);
app.post("/v1/addMatch", addMatch);
module.exports = app;
