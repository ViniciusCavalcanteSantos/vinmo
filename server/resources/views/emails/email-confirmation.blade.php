<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Email Confirmation') }}</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f6f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
    <tr>
        <td align="center">
            <table width="400" cellpadding="0" cellspacing="0"
                   style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; max-width: 400px;">

                <!-- Header -->
                <tr>
                    <td style="background-color: #4f46e5; text-align: center; padding: 30px;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">{{ __('Confirm your Email') }}</h1>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding: 30px; text-align: center; color: #333333;">
                        <p style="font-size: 16px; line-height: 1.5;">
                            {{ __('Hello!') }} 👋 <br>
                            {{ __('To continue your registration, use the code below:') }}
                        </p>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                            <tbody>
                            <tr>
                                <td align="center"><span
                                            style="font-size:32px;font-weight:bold;color:#4f46e5;margin:20px 0;letter-spacing:4px;padding-right: 5px">{{ substr($code, 0, 3) }}</span><span
                                            style="font-size:32px;font-weight:bold;color:#4f46e5;margin:20px 0;letter-spacing:4px;padding-left: 5px">{{ substr($code, 3, 3) }}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <p style="font-size: 14px; color: #666666; line-height: 1.5;">
                            {{ __('Enter this code in the form to verify your email.') }} <br>
                            {{ __("If you didn't request this email, just ignore it.") }}
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background-color: #f4f6f8; text-align: center; padding: 20px; font-size: 12px; color: #999999;">© {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
