import { Resend } from 'resend'

const APP_URL = process.env.APP_URL || 'http://localhost:3000'

// Lazy initialize Resend client
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const client = getResendClient()
  const fromEmail = process.env.FROM_EMAIL
  
  if (!fromEmail) {
    console.error('FROM_EMAIL environment variable is not set')
    return { success: false, error: 'FROM_EMAIL not configured' }
  }
  
  // If no API key, log to console in development
  if (!client) {
    console.log('📧 Email (dev mode):')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Text: ${text}`)
    console.log('---')
    return { success: true, data: { id: 'dev-mode' } }
  }

  try {
    console.log('📧 Sending email via Resend...')
    console.log(`From: ${fromEmail}`)
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    
    const data = await client.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    })
    
    console.log('📧 Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

function getVerificationEmailHtml(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
<div style="text-align: center; margin-bottom: 32px;">
<h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">Welcome to DreamPaths!</h1>
<p style="color: #666; font-size: 16px; margin: 0;">Let's verify your email to get started</p>
</div>
<p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
Click the button below to verify your email address and start your child's learning adventure!
</p>
<div style="text-align: center; margin-bottom: 32px;">
<a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
Verify Email Address
</a>
</div>
<p style="color: #888; font-size: 14px; text-align: center;">
This link expires in 24 hours. If you didn't sign up for DreamPaths, you can ignore this email.
</p>
<p style="color: #888; font-size: 12px; text-align: center; margin-top: 24px;">
Or copy and paste this link: ${verifyUrl}
</p>
</div>
</body>
</html>`
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify?token=${token}`
  
  return sendEmail({
    to: email,
    subject: 'Verify your DreamPaths account',
    text: `Welcome to DreamPaths! Click this link to verify your email: ${verifyUrl}`,
    html: getVerificationEmailHtml(verifyUrl),
  })
}

export async function sendNewMissionEmail(email: string, parentName: string, childName: string, missionTitle: string) {
  const dashboardUrl = `${APP_URL}/dashboard`
  
  return sendEmail({
    to: email,
    subject: `${childName}'s new mission is ready!`,
    text: `Hi ${parentName}, ${childName} has a new mission waiting: "${missionTitle}". Visit ${dashboardUrl} to start!`,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
<div style="text-align: center; margin-bottom: 32px;">
<h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">New Mission Unlocked!</h1>
</div>
<p style="color: #444; font-size: 16px; line-height: 1.6;">Hi ${parentName},</p>
<p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
${childName} has a new mission waiting: <strong>"${missionTitle}"</strong>
</p>
<div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
<p style="color: #92400e; font-size: 14px; margin: 0; text-align: center;">
Most kids complete this mission in about 30-45 minutes
</p>
</div>
<div style="text-align: center; margin-bottom: 32px;">
<a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
Start Mission
</a>
</div>
</div>
</body>
</html>`,
  })
}

export async function sendInactivityReminder(email: string, parentName: string, childName: string, lastMissionTitle: string) {
  const dashboardUrl = `${APP_URL}/dashboard`
  
  return sendEmail({
    to: email,
    subject: `${childName}'s adventure awaits!`,
    text: `Hi ${parentName}, It's been a week since ${childName}'s last mission. Their game development journey is waiting to continue! Visit ${dashboardUrl}`,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
<div style="text-align: center; margin-bottom: 32px;">
<h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">We miss ${childName}!</h1>
</div>
<p style="color: #444; font-size: 16px; line-height: 1.6;">Hi ${parentName},</p>
<p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
It's been a week since ${childName}'s last mission. Their game development journey is waiting to continue!
</p>
<div style="background: #f0fdf4; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
<p style="color: #166534; font-size: 14px; margin: 0;">
<strong>Tip:</strong> Even 15 minutes of creative work helps kids build real skills. The next mission is ready whenever ${childName} is!
</p>
</div>
<div style="text-align: center; margin-bottom: 32px;">
<a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
Continue Adventure
</a>
</div>
</div>
</body>
</html>`,
  })
}

export async function sendParentPinEmail(parentName: string, email: string, pin: string) {
  const digits = pin.split('').join('&nbsp;&nbsp;')
  return sendEmail({
    to: email,
    subject: 'Your DreamPaths parent dashboard PIN',
    text: `Hi ${parentName}, your one-time PIN is: ${pin} — it expires in 15 minutes.`,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
<div style="text-align: center; margin-bottom: 32px;">
<h1 style="color: #1a1a2e; font-size: 22px; margin: 0 0 8px;">Parent Dashboard Access</h1>
<p style="color: #666; font-size: 15px; margin: 0;">Hi ${parentName}, here's your one-time PIN</p>
</div>
<div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 28px;">
<p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 12px; letter-spacing: 1px; text-transform: uppercase;">Your PIN</p>
<p style="color: white; font-size: 42px; font-weight: 800; letter-spacing: 8px; margin: 0; font-variant-numeric: tabular-nums;">${digits}</p>
</div>
<p style="color: #888; font-size: 14px; text-align: center; margin: 0;">
This PIN expires in <strong>15 minutes</strong> and can only be used once.<br>
If you didn't request this, you can safely ignore this email.
</p>
</div>
</body>
</html>`,
  })
}

export async function sendContactEmail(name: string, email: string, type: string, message: string) {
  const typeLabels: Record<string, string> = {
    question: 'Question',
    complaint: 'Complaint',
    feedback: 'Feedback',
    help: 'Help Request',
  }
  const typeLabel = typeLabels[type] ?? type

  return sendEmail({
    to: process.env.FROM_EMAIL ?? 'support@dreampaths.co.uk',
    subject: `[Contact] ${typeLabel} from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nType: ${typeLabel}\n\n${message}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fef7f0; padding: 40px 20px;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
<h2 style="color: #1a1a2e; margin: 0 0 24px;">New Contact Form Submission</h2>
<table style="width: 100%; border-collapse: collapse; font-size: 15px;">
<tr><td style="padding: 8px 0; color: #888; width: 80px;">Name</td><td style="padding: 8px 0; color: #1a1a2e; font-weight: 600;">${name}</td></tr>
<tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td></tr>
<tr><td style="padding: 8px 0; color: #888;">Type</td><td style="padding: 8px 0; color: #1a1a2e;">${typeLabel}</td></tr>
</table>
<div style="margin-top: 24px; padding: 20px; background: #f8f7ff; border-radius: 12px;">
<p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
</div>
</div>
</body>
</html>`,
  })
}

export async function sendWelcomeEmail(email: string, parentName: string, childName: string) {
  const dashboardUrl = `${APP_URL}/dashboard`
  
  return sendEmail({
    to: email,
    subject: 'Welcome to DreamPaths!',
    text: `Hi ${parentName}, ${childName} is enrolled in the Junior Game Developer path! Visit ${dashboardUrl} to get started.`,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
<div style="text-align: center; margin-bottom: 32px;">
<h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">You're all set!</h1>
<p style="color: #666; font-size: 16px; margin: 0;">${childName}'s journey begins now</p>
</div>
<p style="color: #444; font-size: 16px; line-height: 1.6;">Hi ${parentName},</p>
<p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
${childName} is enrolled in the <strong>Junior Game Developer</strong> path! Over the next few weeks, they'll design characters, build game scenes, and create their very own playable game.
</p>
<div style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
<h3 style="color: #5b21b6; margin: 0 0 12px; font-size: 16px;">What's Next?</h3>
<ul style="color: #6d28d9; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
<li>Mission 1 is ready: "Design Your Hero"</li>
<li>Takes about 30 minutes</li>
<li>Perfect for after school or weekends</li>
</ul>
</div>
<div style="text-align: center; margin-bottom: 32px;">
<a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
Go to Dashboard
</a>
</div>
<p style="color: #888; font-size: 14px; text-align: center;">
Questions? Just reply to this email - we're here to help!
</p>
</div>
</body>
</html>`,
  })
}
