
const axios = require("axios")
const { updateUser, searchUser } = require("./userService")
const { doc, addDoc, collection,  getDocs,updateDoc } = require("firebase/firestore");
const {admindb, db} = require("../firebase");


const payload = require("./data/paymentPayload");
const razorpay = require("../razorpay");
const paymentPageFields = {email: "email", orderId: "fantasyorderid"};
const orderPaid = async (req, res) => {
    const secret = "";

    if (verifySignature(req.headers, secret)) {
        let razorPayData = req.body.payload.payment.entity
        console.log("razorda", razorPayData);
        let userData = await searchUser(razorPayData.email, "FantasyUser");
        // parseInt(razorPayData.amount)/100,
        if (userData === null) {
            const userObj = {
                email: razorPayData.email,
                uid: razorPayData.contact,
                amount: 0,
                profileImage: null,
                dateOfBirth: null,
                gender: null,
                contact: razorPayData.contact,
                transactions: [{paymentId: razorpay.id}]
            }

        try {
            const docRef = await addDoc(collection(db, "FantasyUser"), userObj)
            // console.log("docref", docRef.id)
            await updateDoc(docRef, {id: docRef.id})
            console.log('Document added successfully');
          } catch (error) {
            console.error('Error adding document:', error);
          }
        } else {
            // console.log("userdataaaa", userData)
            if (userData.transactions === undefined){
                userData.transactions = [];                
            }
            // findTransaction(razorPayData[paymentPageFields.orderId])
            const transactions = userData.transactions.map(transaction => {
                if (transaction["fantasyOrderId"] === razorPayData.notes[paymentPageFields.orderId]){
                    return {...transaction, status: razorPayData.status,
                    paymentId: razorPayData.id}
                }
                return transaction;
            })
            await updateUser({...userData, transactions: [...transactions]})
        }
    }
    res.send("helloooo");
}

const verifySignature = (headers, secret) => {
    return true;
}

const placeBet = async (req, res) => {
    // return res.status(200).send({"hi": 123});
    // const resp = await axios.get("https://rzp.io/l/M5ad38O8Xy", {headers: {
    //     "Access-Control-Allow-Origin": "*"
    //   }});
    //   console.log(resp);
    // console.log(req);
    // console.log(res);
    
    res.redirect("http://localhost:3000")
}


module.exports = {
    placeBet,
    orderPaid
}