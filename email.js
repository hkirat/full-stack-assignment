const nodemailer = require('nodemailer');

// Function to send confirmation email
const sendConfirmationEmail = async (email, token) => {
    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount( async (err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        console.log(`Credentials obtained, sending message...${account.user} ${account.pass}`);

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Message object
        let message = {
            from: 'Sender Name <sender@example.com>',
            to: `Recipient <${email}>`,
            subject: 'Please confirm your email address',
            text: 'Hello to myself!',
            html: `
            <p>Thanks for signing up! Please click the following link to confirm your email address:</p>
            <p><a href="http://localhost:3000/confirm-email?email=${email}&token=${token}">Confirm Email Address</a></p>
            `,
        };

        try {
            // Send the email
            const info = await transporter.sendMail(message);
            console.log(`Confirmation email sent: ${info.messageId}`);
            console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
          } catch (err) {
            console.error(`Error sending confirmation email to ${to}: ${err}`);
          }
    });
};
module.exports = { sendConfirmationEmail };