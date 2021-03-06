const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
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
          message: `Email has been sent to ${email}. Follow the instructions to setup your account.`,
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

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Expired link. Signup again",
          });
        }
        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });
        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try signup again.",
            });
          }
          return res.json({
            message: "Signup success. Please signin.",
          });
        });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with bad email. Does not exist. Please signup.",
      });
    }
    //Match password with what is saved in DB
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match.",
      });
    }
    //generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }
    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }
    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `<p>Please use the following link to reset your password</p><p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p><hr /><p>This email may contain sensitive information.</p><p>${process.env.CLIENT_URL}</p>`,
    };
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          error: "Database connection error on user forgot password request",
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log("SIGNUP EMAIL SENT:", sent);
            return res.json({
              message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
            });
          })
          .catch((err) => {
            // console.log("SIGNUP EMAIL SENT ERROR", err);
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, decoded) => {
        if (err) {
          return res.status(400).json({ error: "Expired link. Try again" });
        }
        User.findOne({resetPasswordLink}, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Something went wrong. Try later'
            });
          } 
        })
      }
    );
  }
};
