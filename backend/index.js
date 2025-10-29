const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("Backend Connected.....")
})

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Connected to DataBase")
    }).catch(() => {
        console.log("Failed to Connect DataBase")
    })

const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail", (req, res) => {
    const message = req.body.message
    const emailList = req.body.emailList

    credential.find().then((data) => {
        const transporter = nodemailer.createTransport(
            {
                service: "gmail",
                auth: {
                    user: data[0].toJSON().user,
                    pass: data[0].toJSON().pass
                }
            }
        )

        new Promise(async (resolve, reject) => {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "abik10203@gmail.com",
                            to: emailList[i],
                            subject: "A Message from BuilkMail App",
                            text: message
                        }
                    )
                    console.log("Email send to:", emailList[i])
                }
                resolve("Success")
            } catch (error) {
                reject("Failed")
            }
        })
            .then(() => {
                res.status(200).send(true)
            }).catch(() => {
                res.status(400).send(false)
            })

    }).catch((error) => {
        console.log(error)
    })
})

app.listen(PORT, () => {
    console.log(`Server started at the port number in ${PORT}`)
})