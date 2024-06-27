const nodemailer = require('nodemailer')

const sendEmail = async options =>{
    const transport ={
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SEND_MAIL,
            pass:process.env.MAIL_PASS
        }
    
    };
    console.log(options)

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from:`${process.env.SEND_MAIL} <${process.env.SMTH_FROM_EMAIL}> `,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(message)
}

module.exports =sendEmail;