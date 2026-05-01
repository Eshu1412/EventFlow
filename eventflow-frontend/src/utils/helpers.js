// src/utils/helpers.js

export const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric"
  });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });
};

export const formatPrice = (price) => {
  if (!price || price === 0) return "Free";
  return `\u20B9${Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + "…" : str;

export const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export const roleColor = (role) => ({
  user: "badge-blue", organizer: "badge-purple", admin: "badge-red"
}[role] || "badge-gray");

export const statusColor = (status) => ({
  confirmed: "badge-green", pending: "badge-amber", cancelled: "badge-red",
  active: "badge-green", draft: "badge-amber", ended: "badge-gray"
}[status?.toLowerCase()] || "badge-gray");
