{{-- resources/views/emails/password-reset.blade.php --}}
@props(['user', 'token'])

@php
    $appName = config('app.name', 'Vinmo');
    $appUrlClient = config('app.url_client');
    $resetUrl = "{$appUrlClient}/reset-password?token={$token}&email=" . urlencode($user->email);
@endphp

        <!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Redefinição de senha — {{ $appName }}</title>
</head>
<body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f6f6f6; margin:0; padding:20px;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
                <tr>
                    <td style="padding:28px 32px; text-align:left;">
                        <h2 style="margin:0 0 8px 0;">Redefinir sua senha</h2>
                        <p style="margin:0 0 18px 0; color:#555;">
                            Olá {{ $user->name ?? $user->email }}, recebemos uma solicitação para redefinir sua senha do {{ $appName }}.
                        </p>

                        <div style="text-align:center; margin:26px 0;">
                            <a href="{{ $resetUrl }}" target="_blank" rel="noopener"
                               style="display:inline-block; padding:12px 22px; border-radius:8px; text-decoration:none; font-weight:600; border:1px solid #1a73e8; background:#1a73e8; color:#ffffff;">
                                Redefinir senha
                            </a>
                        </div>

                        <p style="color:#666; font-size:13px;">
                            Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:
                        </p>
                        <p style="word-break:break-all; font-size:13px; color:#1a73e8;">
                            <a href="{{ $resetUrl }}" target="_blank" rel="noopener" style="color:#1a73e8; text-decoration:none;">{{ $resetUrl }}</a>
                        </p>

                        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

                        <p style="color:#999; font-size:12px; margin:0;">
                            Se você não solicitou a redefinição de senha, ignore este e-mail — nada será alterado.
                            Este link expira em <strong>60 minutos</strong>.
                        </p>

                        <p style="color:#999; font-size:12px; margin-top:12px;">
                            — Equipe {{ $appName }}
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="background:#fafafa; padding:12px 32px; text-align:center; color:#999; font-size:12px;">
                        {{ $appName }} • {{ url('/') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<div style="display:none; white-space:pre; font-family:monospace; font-size:12px; color:#111;">
    Olá {{ $user->name ?? $user->email }},

    Recebemos uma solicitação para redefinir sua senha do {{ $appName }}.

    Use o link abaixo para redefinir sua senha:
    {{ $resetUrl }}

    Se você não pediu a redefinição, ignore esta mensagem. O link expira em 60 minutos.
</div>
</body>
</html>
