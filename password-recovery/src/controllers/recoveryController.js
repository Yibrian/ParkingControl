
const nodemailer = require('nodemailer');
const axios = require('axios');

const sendRecoveryEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El correo es obligatorio.' });
    }

    try {
        // Obtener datos del usuario desde parking-control
        const response = await axios.get(`${process.env.PARKING_CONTROL_API}/users/email/${email}`);
        const user = response.data;

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Configurar transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Enviar correo
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Hola ${user.name}, usa este enlace para recuperar tu contraseña: http://front-parking/reset-password?token=example-token`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo de recuperación enviado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar el correo.' });
    }
};

module.exports = { sendRecoveryEmail };