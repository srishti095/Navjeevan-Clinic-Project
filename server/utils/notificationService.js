import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const emailTransporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587),
      secure: String(process.env.EMAIL_SECURE || "false") === "true",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  : null;

const clinicName = "Navjeevan Clinic";
export const sendEmail = async ({ to, subject, html }) => {
  if (!to) return { sent: false, channel: "email", reason: "missing-recipient" };
  if (!emailTransporter) {
    console.warn(`[EMAIL NOT CONFIGURED] ${to} | ${subject}`);
    return { sent: false, channel: "email", reason: "not-configured" };
  }
  await emailTransporter.sendMail({
    from: process.env.EMAIL_FROM || `"${clinicName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  return { sent: true, channel: "email" };
};

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

export const sendNotification = async ({ user, emailSubject, emailHtml }) => {
  // Navjeevan Clinic uses email only for OTPs and appointment notifications.
  if (!user?.email) return [{ sent: false, channel: "email", reason: "missing-recipient" }];
  try {
    return [await sendEmail({ to: user.email, subject: emailSubject, html: emailHtml })];
  } catch (error) {
    console.error("Email notification failed:", error.message);
    return [{ sent: false, channel: "email", error: error.message }];
  }
};

export const appointmentNotification = ({ user, appointment, type }) => {
  const patientName = escapeHtml(user?.fullName || "Patient");
  const doctorName = escapeHtml(appointment?.doctor?.fullName || "Dr. Aayushi Pal");
  const serviceName = escapeHtml(appointment?.service?.name || "Consultation");
  const number = escapeHtml(appointment?.appointmentNumber || "");
  const date = escapeHtml(appointment?.appointmentDate || "");
  const time = escapeHtml(appointment?.timeSlot || "");
  const reason = escapeHtml(appointment?.cancelReason || "");
  const base = `${clinicName} | Appointment ${appointment?.appointmentNumber || ""}`;
  let subject = base;
  let title = "Appointment Update";
  let message = "";

  if (type === "booked") {
    title = "Appointment Request Received";
    message = `Your appointment request has been received and is pending clinic confirmation.`;
    subject = "Navjeevan Clinic - Appointment Request Received";
  } else if (type === "confirmed") {
    title = "Appointment Confirmed";
    message = `Your appointment is confirmed. Please arrive on time and carry any relevant medical records.`;
    subject = "Navjeevan Clinic - Appointment Confirmed";
  } else if (type === "cancelled") {
    title = "Appointment Cancelled";
    message = `Your appointment has been cancelled.${reason ? ` Reason: ${reason}` : ""}`;
    sms = `Navjeevan Clinic: Appointment ${appointment?.appointmentNumber} for ${appointment?.appointmentDate} at ${appointment?.timeSlot} has been CANCELLED.${appointment?.cancelReason ? ` Reason: ${appointment.cancelReason}` : ""}`;
    subject = "Navjeevan Clinic - Appointment Cancelled";
  } else if (type === "completed") {
    title = "Appointment Completed";
    message = `Your appointment has been marked completed. Thank you for choosing Navjeevan Clinic.`;
    subject = "Navjeevan Clinic - Appointment Completed";
  } else if (type === "payment") {
    title = "Payment Successful";
    message = `Your payment has been verified and your appointment is confirmed.`;
    subject = "Navjeevan Clinic - Payment Confirmed";
  }

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f8f6f3;padding:24px"><div style="max-width:620px;margin:auto;background:#fff;border-radius:16px;padding:28px;border:1px solid #eee"><h2 style="color:#c51e3a;margin-top:0">${escapeHtml(clinicName)}</h2><h3>${escapeHtml(title)}</h3><p>Dear ${patientName},</p><p>${escapeHtml(message)}</p><table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse"><tr><td><b>Appointment</b></td><td>${number}</td></tr><tr><td><b>Doctor</b></td><td>${doctorName}</td></tr><tr><td><b>Service</b></td><td>${serviceName}</td></tr><tr><td><b>Date</b></td><td>${date}</td></tr><tr><td><b>Time</b></td><td>${time}</td></tr></table><p style="margin-top:24px;color:#666">For help, contact Navjeevan Clinic.</p></div></body></html>`;
  return { subject, html };
};

export const sendWelcomeNotification = async ({ user }) => sendNotification({
  user,
  emailSubject: "Welcome to Navjeevan Clinic",
  emailHtml: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px"><h2 style="color:#c51e3a">Welcome to Navjeevan Clinic</h2><p>Dear ${escapeHtml(user?.fullName || "Patient")},</p><p>Your patient account has been created successfully.</p><p>You can now book appointments and manage your clinic records from your patient dashboard.</p><p><b>Registered email:</b> ${escapeHtml(user?.email || "")}</p><p><b>Registered phone:</b> ${escapeHtml(user?.phone || "")}</p></div>`,
});


export const sendVideoReminderNotification = async ({ user, appointment }) => {
  const patientName = user?.fullName || "Patient";
  const date = appointment?.appointmentDate || "";
  const time = appointment?.timeSlot || "";
  return sendNotification({
    user,
    emailSubject: "Navjeevan Clinic - Appointment Reminder",
    emailHtml: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px"><h2 style="color:#c51e3a">Navjeevan Clinic</h2><h3>Appointment Reminder</h3><p>Hello ${escapeHtml(patientName)},</p><p>This is a reminder from Navjeevan Clinic. Your appointment is on <b>${escapeHtml(date)}</b> at <b>${escapeHtml(time)}</b>. Please arrive on time. Thank you.</p></div>`,
  });
};
