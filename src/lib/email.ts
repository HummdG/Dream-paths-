import { Resend } from 'resend'

const FROM_EMAIL = process.env.FROM_EMAIL || 'DreamPath Kids <noreply@dreampathkids.com>'
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
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  const client = getResendClient()
  
  // If no API key, log to console in development
  if (!client) {
    console.log('📧 Email (dev mode):')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('---')
    return { success: true, data: { id: 'dev-mode' } }
  }

  try {
    const data = await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`
  
  return sendEmail({
    to: email,
    subject: 'Verify your DreamPath Kids account ✨',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">🚀</span>
              <h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">Welcome to DreamPath Kids!</h1>
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
              This link expires in 24 hours. If you didn't sign up for DreamPath Kids, you can ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendNewMissionEmail(email: string, parentName: string, childName: string, missionTitle: string) {
  const dashboardUrl = `${APP_URL}/dashboard`
  
  return sendEmail({
    to: email,
    subject: `${childName}'s new mission is ready! 🎮`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">🎮</span>
              <h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">New Mission Unlocked!</h1>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Hi ${parentName},
            </p>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              ${childName} has a new mission waiting: <strong>"${missionTitle}"</strong>
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
              <p style="color: #92400e; font-size: 14px; margin: 0; text-align: center;">
                ⏱️ Most kids complete this mission in about 30-45 minutes
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                Start Mission
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendInactivityReminder(email: string, parentName: string, childName: string, lastMissionTitle: string) {
  const dashboardUrl = `${APP_URL}/dashboard`
  
  return sendEmail({
    to: email,
    subject: `${childName}'s adventure awaits! 🌟`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">🌟</span>
              <h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">We miss ${childName}!</h1>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Hi ${parentName},
            </p>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              It's been a week since ${childName}'s last mission. Their game development journey is waiting to continue!
            </p>
            
            <div style="background: #f0fdf4; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
              <p style="color: #166534; font-size: 14px; margin: 0;">
                💡 <strong>Tip:</strong> Even 15 minutes of creative work helps kids build real skills. The next mission is ready whenever ${childName} is!
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                Continue Adventure
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

export async function sendWelcomeEmail(email: string, parentName: string, childName: string) {
  const dashboardUrl = `${APP_URL}/dashboard`
  
  return sendEmail({
    to: email,
    subject: `Welcome to DreamPath Kids! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #fef7f0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">🎉</span>
              <h1 style="color: #1a1a2e; font-size: 24px; margin: 16px 0 8px;">You're all set!</h1>
              <p style="color: #666; font-size: 16px; margin: 0;">${childName}'s journey begins now</p>
            </div>
            
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Hi ${parentName},
            </p>
            
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
      </html>
    `,
  })
}
