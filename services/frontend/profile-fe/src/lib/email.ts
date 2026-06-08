import nodemailer from "nodemailer";

// Initialize nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifySmtpConnection() {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const from = process.env.SMTP_FROM || '"IEEE RITB" <noreply@ieee-ritb.org>';
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

/**
 * Sends the beautifully styled welcome/onboarding email to new users
 */
export async function sendOnboardingEmail({
  email,
  name,
  username,
  membershipId,
  password,
}: {
  email: string;
  name: string;
  username: string;
  membershipId: string;
  password: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://profile.ritb.in";

  const subject = "Your IEEE RITB Profile is Live!";
  const text = `Hello ${name},\n\nYour account has been created successfully.\n\nUsername: ${username}\nMembership ID: ${membershipId}\nPassword: ${password}\n\nPlease log in at ${appUrl}/auth/sign-in\n\nBest regards,\nIEEE RITB Team`;

  const html = `<div style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#00629B;padding:40px 32px;">
              <img
                src="https://res.cloudinary.com/ddrv7lqrg/image/upload/v1760040051/ieee-logo-square_lzpsoz.jpg"
                alt="IEEE RITB"
                width="76"
                height="76"
                style="display:block;margin:0 auto 20px;border-radius:12px;padding:5px;background:#ffffff;"
              />
              <p style="margin:0 0 10px;font-size:11px;font-weight:500;letter-spacing:2px;color:#7ec8f4;text-transform:uppercase;">IEEE RITB Student Branch</p>
              <h1 style="margin:0 0 10px;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Your profile portal is live.</h1>
              <p style="margin:0;color:#b8ddf5;font-size:14px;line-height:1.6;">This is the official home for every IEEE RITB member.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;background:#ffffff;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:500;letter-spacing:0.5px;">Hello,</p>
              <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0f172a;">${name} 👋</p>
              <p style="font-size:15px;line-height:1.8;color:#1e293b;margin:0 0 16px;">
                We just launched the <a href="${appUrl}" style="color:#00629B; text-decoration: none;font-weight: 600;">IEEE RITB Profile Portal</a> — the one platform that will centrally manage the identity, records, and presence of every member of the club. This email is attached with your login credentials and the steps you have to take to get started.
              </p>
              <p style="font-size:15px;line-height:1.8;color:#475569;margin:0 0 28px;">
                Your account is ready. Here are your login credentials to get in:
              </p>

              <!-- Credentials Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;">Your login details</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #e8edf2;font-size:13px;color:#64748b;width:50%;">Username</td>
                        <td style="padding:10px 0;border-bottom:1px solid #e8edf2;font-size:14px;font-weight:600;color:#0f172a;text-align:right;">${username}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #e8edf2;font-size:13px;color:#64748b;">Membership ID</td>
                        <td style="padding:10px 0;border-bottom:1px solid #e8edf2;font-size:14px;font-weight:600;color:#0f172a;text-align:right;">${membershipId}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;font-size:13px;color:#64748b;">Password</td>
                        <td style="padding:10px 0;text-align:right;">
                          <span style="font-size:13px;background:#eef2f7;border:1px solid #d1dce8;border-radius:6px;padding:4px 10px;color:#0f172a;font-family:Courier New,Courier,monospace;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Items -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #f4b400;border-radius:12px;background:#fffbf0;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#92600a;">Action required</p>

                    <!-- Step 1 -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                      <tr>
                        <td width="28" valign="top" style="padding-top:1px;">
                          <div style="width:20px;height:20px;border-radius:50%;background:#00629B;text-align:center;line-height:20px;">
                            <span style="font-size:11px;color:#ffffff;font-weight:700;">1</span>
                          </div>
                        </td>
                        <td style="font-size:14px;color:#5a3800;line-height:1.6;padding-left:4px;">Log in using the credentials above and reset your password.</td>
                      </tr>
                    </table>

                    <!-- Step 2 -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                      <tr>
                        <td width="28" valign="top" style="padding-top:1px;">
                          <div style="width:20px;height:20px;border-radius:50%;background:#00629B;text-align:center;line-height:20px;">
                            <span style="font-size:11px;color:#ffffff;font-weight:700;">2</span>
                          </div>
                        </td>
                        <td style="font-size:14px;color:#5a3800;line-height:1.6;padding-left:4px;">Review and complete your profile information.</td>
                      </tr>
                    </table>

                    <!-- Step 3 -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="28" valign="top" style="padding-top:1px;">
                          <div style="width:20px;height:20px;border-radius:50%;background:#f4b400;text-align:center;line-height:20px;">
                            <span style="font-size:11px;color:#ffffff;font-weight:700;">&#9733;</span>
                          </div>
                        </td>
                        <td style="font-size:14px;color:#5a3800;line-height:1.6;padding-left:4px;"><strong style="color:#8a5900;">Upload your profile photo.</strong> It'll be used for the upcoming Team Reveal — don't miss out.</td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/auth/sign-in"
                       style="display:inline-block;background:#00629B;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
                      Login to your account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;line-height:1.8;color:#64748b;margin:0 0 4px;">Excited to have you on board. Let's build something great together.</p>
              <p style="font-size:14px;color:#0f172a;margin:0;font-weight:600;">— IEEE RITB Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;background:#f8fafc;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;">IEEE Ramaiah Institute of Technology Bangalore · Student Branch</p>
              <p style="margin:0;font-size:11px;color:#94a3b8;">If you weren't expecting this email, you can safely ignore it.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`;

  return sendEmail({ to: email, subject, text, html });
}

/**
 * Sends a beautifully styled reset password email to users
 */
export async function sendResetPasswordEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  const subject = "Reset Your IEEE RITB Profile Portal Password";
  const text = `Hello ${name},\n\nA password reset request was received for your account. Please reset your password by clicking the link: ${resetUrl}\n\nBest regards,\nIEEE RITB Team`;

  const html = `<div style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#00629B;padding:40px 32px;">
              <img
                src="https://res.cloudinary.com/ddrv7lqrg/image/upload/v1760040051/ieee-logo-square_lzpsoz.jpg"
                alt="IEEE RITB"
                width="76"
                height="76"
                style="display:block;margin:0 auto 20px;border-radius:12px;padding:5px;background:#ffffff;"
              />
              <p style="margin:0 0 10px;font-size:11px;font-weight:500;letter-spacing:2px;color:#7ec8f4;text-transform:uppercase;">IEEE RITB Student Branch</p>
              <h1 style="margin:0 0 10px;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Security: Reset Password</h1>
              <p style="margin:0;color:#b8ddf5;font-size:14px;line-height:1.6;">Establish a new secure connection for your profile.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;background:#ffffff;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:500;letter-spacing:0.5px;">Hello,</p>
              <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0f172a;">${name} 👋</p>
              <p style="font-size:15px;line-height:1.8;color:#1e293b;margin:0 0 16px;">
                A password reset request was received for your IEEE RITB account. If you did not make this request, you can safely ignore this email — your password remains completely unchanged and secure.
              </p>
              <p style="font-size:15px;line-height:1.8;color:#475569;margin:0 0 28px;">
                To establish a new password and reconnect to your profile portal, click the button below:
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}"
                       style="display:inline-block;background:#00629B;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
                      Reset Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;line-height:1.8;color:#64748b;margin:0 0 4px;">For security, this link is single-use only and expires in 1 hour.</p>
              <p style="font-size:14px;color:#0f172a;margin:0;font-weight:600;">— IEEE RITB Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;background:#f8fafc;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;">IEEE Ramaiah Institute of Technology Bangalore · Student Branch</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`;

  return sendEmail({ to: email, subject, text, html });
}

/**
 * Sends a verification email to the NEW email address when a user requests an email change.
 * The user must click the link in this email to confirm the change.
 */
export async function sendEmailChangeVerificationEmail({
  email,
  name,
  verificationUrl,
}: {
  email: string;
  name: string;
  verificationUrl: string;
}) {
  const subject = "Confirm Your New Email Address — IEEE RITB";
  const text = `Hello ${name},\n\nA request was made to change your IEEE RITB account email to this address. Click the link below to confirm: ${verificationUrl}\n\nIf you did not request this change, you can safely ignore this email.\n\nBest regards,\nIEEE RITB Team`;

  const html = `<div style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#00629B;padding:40px 32px;">
              <img
                src="https://res.cloudinary.com/ddrv7lqrg/image/upload/v1760040051/ieee-logo-square_lzpsoz.jpg"
                alt="IEEE RITB"
                width="76"
                height="76"
                style="display:block;margin:0 auto 20px;border-radius:12px;padding:5px;background:#ffffff;"
              />
              <p style="margin:0 0 10px;font-size:11px;font-weight:500;letter-spacing:2px;color:#7ec8f4;text-transform:uppercase;">IEEE RITB Student Branch</p>
              <h1 style="margin:0 0 10px;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Confirm Your New Email</h1>
              <p style="margin:0;color:#b8ddf5;font-size:14px;line-height:1.6;">A verification is required to update your account email address.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;background:#ffffff;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:500;letter-spacing:0.5px;">Hello,</p>
              <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0f172a;">${name} 👋</p>
              <p style="font-size:15px;line-height:1.8;color:#1e293b;margin:0 0 16px;">
                A request was made to change your IEEE RITB account email address to <strong>${email}</strong>. To confirm this change, click the button below.
              </p>
              <p style="font-size:15px;line-height:1.8;color:#475569;margin:0 0 28px;">
                If you did not request this change, you can safely ignore this email — your account remains unchanged.
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}"
                       style="display:inline-block;background:#00629B;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
                      Confirm Email Change &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px;line-height:1.8;color:#64748b;margin:0 0 4px;">This link is single-use and expires in 1 hour.</p>
              <p style="font-size:14px;color:#0f172a;margin:0;font-weight:600;">— IEEE RITB Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;background:#f8fafc;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;">IEEE Ramaiah Institute of Technology Bangalore · Student Branch</p>
              <p style="margin:0;font-size:11px;color:#94a3b8;">If you weren't expecting this email, you can safely ignore it.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`;

  return sendEmail({ to: email, subject, text, html });
}
