// Validate YYYY-MM-DD and check whether it's a real date
export const isValidDate = (dateString) => {
  if (typeof dateString !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
};

// Get weekday (0 = Sunday, 6 = Saturday)
export const weekdayOf = (dateString) => {
  if (!isValidDate(dateString)) return null;

  const date = new Date(`${dateString}T00:00:00.000Z`);

  return date.getUTCDay();
};

// Move one calendar day backward
export const previousDate = (dateString) => {
  if (!isValidDate(dateString)) return null;

  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
};

// Move one calendar day forward
export const nextDate = (dateString) => {
  if (!isValidDate(dateString)) return null;

  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
};

// Get today's date according to the user's timezone
export const todayIn = (timezone = "Asia/Kolkata") => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};