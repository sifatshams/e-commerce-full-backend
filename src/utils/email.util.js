import nodemailer from 'nodemailer';

const sendVerificationEmail = async (toEmail, userName, verificationToken) => {
  // transporter setup
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // create a verification link
  const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  // email content
  const mailOptions = {
    from: `'Inventory APP' <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Verify your email - Inventory APP',
    html: `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello, ${userName}!</h2>
        <p>Thanks for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
        <a href="${verifyURL}" 
           style="display: inline-block; background: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verifyURL}</p>
        <hr />
        <p style="font-size: 0.8em;">This link will expire in 24 hours.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendOtpEmail = async (toEmail, userName, otp) => {
  // transporter setup
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // email content
  const mailOptions = {
    from: `'Inventory APP' <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Your OTP Code - Inventory APP',
    html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
    
    <h2 style="color: #333;">🔐 Inventory APP</h2>
    
    <p style="font-size: 16px; color: #555;">
      Hello ${userName} 👋,
    </p>

    <p style="font-size: 16px; color: #555;">
      Your OTP is:
    </p>

    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2d89ff; margin: 20px 0;">
      ${otp}
    </div>

    <p style="font-size: 14px; color: #777;">
      This OTP will expire in <b>5 minutes</b>.
    </p>

  </div>
</div>
`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPassEmail = async (toEmail, userName, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `'Inventory APP' <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Reset Your Password - Inventory APP',
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <h2 style="color: #333;">🔐 Inventory APP</h2>

        <p style="font-size: 16px; color: #555;">
          Hello ${userName || 'User'} 👋,
        </p>

        <p style="font-size: 16px; color: #555;">
          You requested to reset your password. Click the button below to proceed:
        </p>

        <a href="${resetUrl}" 
           style="display: inline-block; margin: 20px 0; padding: 12px 25px; font-size: 16px; color: #fff; background-color: #2d89ff; border-radius: 5px; text-decoration: none;">
           Reset Password
        </a>

        <p style="font-size: 14px; color: #777;">
          This link will expire in <b>10 minutes</b>.
        </p>

        <p style="font-size: 14px; color: #999;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; font-size: 13px; color: #2d89ff;">
          ${resetUrl}
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #aaa;">
          If you did not request this, you can safely ignore this email.
        </p>

      </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
