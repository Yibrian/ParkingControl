<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Restablecimiento de contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <div style="
                    width: 200px;
                    height: 200px;
                    background-image: url('https://res.cloudinary.com/dhdvp5zp6/image/upload/v1746147881/ParkingControl_aek5hy.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                ">
                </div>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td>
                            <h2 style="color: #333333;">Restablecimiento de contraseña</h2>
                            <p style="color: #555555; font-size: 16px;">
                                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo.
                            </p>
                            <p style="color: #555555; font-size: 16px;">
                                Para continuar con el proceso, haz clic en el botón a continuación:
                            </p>
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/reset-password?token={{ $token }}" style="background-color: #e60000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                    Restablecer contraseña
                                </a>
                            </p>
                            <p style="color: #999999; font-size: 14px;">
                                Si tienes problemas con el botón anterior, copia y pega el siguiente enlace en tu navegador:<br>
                                <a href="http://localhost:3000/reset-password?token={{ $token }}" style="color: #007BFF;">http://localhost:3000/reset-password?token={{ $token }}</a>
                            </p>
                            <p style="color: #999999; font-size: 14px; margin-top: 40px;">
                                &copy; {{ date('Y') }} Parking Control. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>