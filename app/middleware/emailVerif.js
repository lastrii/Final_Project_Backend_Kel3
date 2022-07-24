const nodemailer = require ('nodemailer');

exports.kirimEmail = dataEmail => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS : true,
        auth: {
          user: "diskusiforum12@gmail.com", 
          pass: "khgqibvmyyeejupz",
        }
      });
      return (
        transporter.sendMail(dataEmail)
        .then (info => console.log(`Email Terkirim : ${info.message}`))
        .catch (err => console.log (`Terjadi Kesalahan :${err}`))
      )
        // console.log(dataEmail)
}