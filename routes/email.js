const { Router } = require('express');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTPSERVER,
    port: 587,
    secure: false,
    requireTLS: true,
    logger: true,
    debug: true,
    auth: {
        //Tendrías que cambiar estas credenciales
        user: process.env.SMTPUSER,
        pass: process.env.SMTPPASSWORD,
    },
});

transporter.verify().then((error, success) => {
    if (error) {
        console.log("Error", error);
    } else {
        console.log("Ready for send emails");
    }
});

const router = Router();

router.post("/send", async (req, res) => {
    try {
        console.log("body", req.body);
        let mail = {
            from: "noreply@example.com",
            // aqui tendrias que cambiar la direccion del correo final
            to: "mjparraga25@gmail.com",
            subject: "Hello",
            html: `                   
                   <p><strong>Nombre de remitente:</strong> ${req.body.name}</p>
                   <p><strong>Detalles del contacto</strong></p>
                   <p><strong>Correo: </strong>${req.body.email}</p>
                   <p><strong>Teléfono: </strong>${req.body.telf}</p>
                   <p><strong>Mensaje: </strong>${req.body.mensaje}</p>
                   <p>Este mensaje se ha generado de forma automática, por favor no responder.</p>
                   `,
        }
        await transporter.sendMail(mail, error => {
            if (error) {
                console.log("Error sending", error);
                res.json({ status: "ERROR" })
            } else {
                res.json({ status: "Message Sent" })
            }
        });
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

module.exports = router;