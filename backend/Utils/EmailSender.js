import nodemailer from 'nodemailer';

class EmailSender {

    static Transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'help@vertera.org',
            pass: 'ertdfgcbc'
        }
    });

    static Notify(email, text) {
        const mailOptions = {
            from: 'help@vertera.org',
            to: email,
            subject: 'VERTERA Help',
            text: text
        };

        // this.Transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });
    }
}

export default EmailSender;