const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const EmailMsg = require("../../model/EmailMessaging/EmailMessaging");
const nodemailer = require("nodemailer");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  
  const { to, subject, message } = req.body;
  //get the message
  const emailMessage = subject + " " + message;
  //prevent profanity/bad words
  const filter = new Filter();

  const isProfane = filter.isProfane(emailMessage);
  if (isProfane){
    throw new Error("Email sent failed, because it contains profane words.");
  }
  try {
    const client = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "arnabjhazen@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
    });
    client.sendMail(
      {
      from: "arnabjhazen@gmail.com",
      to: to,
      subject: subject,
      html: message,
    },
     function (err, msg) {
        if (err) {
          console.error("error mail bhejne me: " + err);
        } 
      }
    );
    
    //save to our db
    await EmailMsg.create({
      sentBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });
    
    res.json("Mail sent");
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };
