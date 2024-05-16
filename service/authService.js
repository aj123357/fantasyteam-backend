const { getAuth, db, adminAuth, admindb } = require("../firebase");
const { sendPasswordResetEmail } = require("firebase/auth");
const { addDoc, collection, updateDoc } = require("firebase/firestore");
const auth = require("firebase/auth");
const { fetchUserService, searchUser } = require("./userService");
const { createRandomUsername } = require("../utils/dbUtil");

const createUserService = async (serviceData) => {
  try {
    const userResponse = await auth.createUserWithEmailAndPassword(
      auth.getAuth(),
      serviceData?.email,
      serviceData?.password
    );
    console.log("ankush useresponse", userResponse?.user);
    console.log("accessToken", userResponse?.user?.accessToken);

    await auth.sendEmailVerification(userResponse?.user);
    let userObj = {};
    if (userResponse?.user?.uid) {
      userObj = {
        email: userResponse?.user?.email,
        uid: userResponse?.user?.uid,
        firstName: serviceData?.firstName || "",
        lastName: serviceData?.lastName || "",
        phoneNumber: null,
        amount: 0,
        username: createRandomUsername(userResponse?.user?.email),
        transactions: [],
        emailVerified: userResponse?.user?.emailVerified,
        accessToken: userResponse?.user?.accessToken,
        refreshToken: userResponse?.user?.refreshToken,
      };
      console.log("ankush userObj", userObj);

      const usersRef = await addDoc(collection(db, "FantasyUser"), userObj);
      // const usersRef = doc(db, "FantasyUser", ref.id)
      await updateDoc(usersRef, {
        id: usersRef.id,
      });
      console.log("ankush userObj", { ...userObj, id: usersRef.id });

      return { ...userObj, id: usersRef.id };
    }
  } catch (e) {
    console.log("Something went wrong in ###createUserService###", e);
    return undefined;
  }
};

const createUniqueUsername = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return "fantasyUser_" + code;
};

const LoginUserService = async (req, res) => {
  const serviceData = req.query;
  try {
    const userResponse = await auth.signInWithEmailAndPassword(
      auth.getAuth(),
      serviceData?.email,
      serviceData?.password
    );
    console.log("userResponse", userResponse);
    const data = await searchUser(userResponse?.user?.email, "FantasyUser");
    console.log("ankush", data);
    return res.status(200).send(data);
  } catch (e) {
    console.log("Something went wrong in ###LoginUserService###", e);
    console.log("ankush not found");

    if (e.code === "auth/wrong-password" || e.code === "auth/invalid-email") {
      return res.status(401).send(e.code);
    } else {
      const data = await createUserService(serviceData);
      console.log("ankush", data);
      if (data === undefined) {
        res.status(500).send("Unable to create User");
      }
      return res.status(200).send(data);
    }
  }
};

const SignOutUserService = async (serviceData) => {
  try {
    const userResponse = await auth.signOut(auth.getAuth());
    return userResponse;
  } catch (e) {
    console.log("Something went wrong in ###SignOutUserService###", e);
    throw new Error(e);
  }
};

const passwordResetEmail = (req, res) => {
  console.log(req.query, req.param, req.body);
  const email = req.query?.email;
  console.log("password reset email", email);
  if (email == null || email === undefined) {
    res.status(400).send("BAD REQUEST. email is null or undefined");
  }

  sendPasswordResetEmail(getAuth, email)
    .then(() => {
      console.log("Password reset email sent successfully");
      res.status(200).send("Password reset email sent successfully");
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      console.log(error);
      res.status(500).send(error);
      // ..
    });
};

module.exports = {
  LoginUserService,
  SignOutUserService,
  createUserService,
  passwordResetEmail,
};
