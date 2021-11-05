const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ****EXAMPLE - Simple User Signup****
// exports.signup = (req, res) => {
//   // console.log("REQ BODY ON SIGNUP", req.body);
//   const { name, email, password } = req.body;
//   User.findOne({ email: email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is already registered",
//       });
//     }
//   });
//   let newUser = new User({ name, email, password });
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("SIGNUP ERROR", err);
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({
//       message: "Signup success! Please signin",
//       //you could also send the user back here ex. user: newUser
//     });
//   });
// };

//****Example - Confirmation Email Signup *****/
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "1d" }
    );
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `<p>Please use the following link to activate your account</p><p>${process.env.CLIENT_URL}/auth/activate/${token}</p><hr /><p>This email may contain sensitive information.</p><p>${process.env.CLIENT_URL}</p>`,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        // console.log("SIGNUP EMAIL SENT:", sent);
        return res.json({
          messsage: `Email has been sent to ${email}. Follow the instructions to setup your account.`,
        });
      })
      .catch((err) => {
        // console.log("SIGNUP EMAIL SENT ERROR", err);
        return res.json({
          message: err.message,
        });
      });
  });
};
