import nodemailer from 'nodemailer';

class EmailSender {

    static Transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'hugehug@mail.ru',
            pass: 'hqhP3c8WggxYeE18QrgS'
        }
    });

    static Notify(email, text) {
        const mailOptions = {
            from: 'hugehug@mail.ru',
            to: email,
            subject: 'Поддержка VERTERA',
            text: text
        };

        this.Transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

export default EmailSender;