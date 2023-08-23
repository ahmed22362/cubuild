import nodemailer from "nodemailer"
import dotenv from "dotenv"
import generateResetPasswordTemplate from "./../templates/resetPasswordTemplate"
import generateWelcomeTemplate from "../templates/welcomeTemplate"
dotenv.config()

export interface MailInterface {
  from?: string
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  text?: string
  html: string
}
let testTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6c17daa23163c3",
    pass: "e879316559a500",
  },
})
// config.get<string>("MAIL_HOST")
// config.get<number>("MAIL_PORT")
// config.get<string>("MAIL_USER")
// config.get<string>("MAIL_PASSWORD")
let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST as any,
  port: process.env.MAIL_PORT as any,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
})

async function sendForgetPasswordEmail(
  resetURL: string,
  name: string,
  email: string
) {
  // create reusable transporter object using Zoho SMTP
  // send mail with defined transport object
  const emailTemplate = generateResetPasswordTemplate(resetURL, name)
  let info = await testTransporter.sendMail({
    from: '"Ahmed Hamada" <ceo@codegate.info>', // sender address
    to: email, // list of receivers
    subject: "Your CuBuild password reset token", // Subject line
    text: emailTemplate.text, // plain text body
    html: emailTemplate.html, // html body
  })

  console.log("Message sent: %s", info.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}

export async function sendWelcomeUser(name: string, email: string) {
  // create reusable transporter object using Zoho SMTP
  // send mail with defined transport object
  const emailTemplate = generateWelcomeTemplate(name)
  let info = await transporter.sendMail({
    from: '"Ahmed Hamada" <ceo@codegate.info>', // sender address
    to: email, // list of receivers
    subject: "Welcome To CuBuild", // Subject line
    html: emailTemplate.html, // html body
  })

  console.log("Message sent: %s", info.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}

export default sendForgetPasswordEmail
