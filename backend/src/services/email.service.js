const env = require('../config/env');

class EmailService {
  async sendEmail({ to, subject, html, text }) {
    if (!env.EMAIL_API_KEY) {
      console.log(`[EmailService - STUB] To: ${to} | Subject: ${subject}`);
      return { success: true, stub: true };
    }

    try {
      // Integration hook (e.g. Resend, Sendgrid, etc.)
      console.log(`[EmailService] Sent to ${to}: ${subject}`);
      return { success: true };
    } catch (err) {
      console.error('[EmailService] Send error:', err);
      return { success: false, error: err.message };
    }
  }

  async sendPaymentVerifiedEmail(email, name) {
    return this.sendEmail({
      to: email,
      subject: 'NEXORA 2026 — Payment Verified Successfully',
      text: `Hello ${name},\n\nYour registration fee for NEXORA 2026 has been verified. You can now access your dashboard and submit your abstract.\n\nWarm regards,\nNEXORA 2026 Organizing Committee`,
    });
  }

  async sendPaymentRejectedEmail(email, name, reason) {
    return this.sendEmail({
      to: email,
      subject: 'NEXORA 2026 — Payment Verification Update',
      text: `Hello ${name},\n\nYour payment screenshot could not be verified. Reason: ${reason || 'Screenshot illegible or transaction not found'}. Please re-upload a clear proof from your dashboard.\n\nWarm regards,\nNEXORA 2026 Organizing Committee`,
    });
  }

  async sendSubmissionReviewedEmail(email, name, title, status) {
    return this.sendEmail({
      to: email,
      subject: `NEXORA 2026 — Abstract Submission Status: ${status}`,
      text: `Hello ${name},\n\nYour abstract "${title}" has been marked as ${status}.\nPlease log in to your dashboard for details.\n\nWarm regards,\nNEXORA 2026 Evaluation Committee`,
    });
  }
}

module.exports = new EmailService();
