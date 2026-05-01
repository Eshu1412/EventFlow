/**
 * ticketDownload.js
 * Downloads a booking ticket PDF from the backend.
 *
 * Usage:
 *   import { downloadTicket } from '../utils/ticketDownload';
 *   await downloadTicket(bookingId);
 */

import axios from "axios";

/**
 * Fetches the PDF ticket for `bookingId` from the backend and
 * triggers a browser file-save dialog.
 *
 * @param {number|string} bookingId
 * @param {string} [eventTitle] - used for the file name
 */
export async function downloadTicket(bookingId, eventTitle = "Event") {
  const response = await axios.get(`/api/bookings/${bookingId}/ticket/`, {
    responseType: "blob", // receive binary PDF
  });

  // Pull filename from Content-Disposition if present
  const disposition = response.headers["content-disposition"] || "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match ? match[1] : `EventFlow_Ticket_${String(bookingId).padStart(6, "0")}.pdf`;

  // Create a temporary <a> element and trigger download
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
}
