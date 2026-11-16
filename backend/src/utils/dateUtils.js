
// Get today's date according to the user's timezone
export const todayIn = (timezone = "Asia/Kolkata") => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};


// Validate YYYY-MM-DD and check whether it's a real date
export const isValidDate = (dateString) => {
  // Check date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  // Convert string into Date object
  const date = new Date(`${dateString}T00:00:00.000Z`);

  // Check whether JavaScript normalized the date
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
};


// Get weekday (0 = Sunday, 6 = Saturday)
export const weekdayOf = (dateString) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  return date.getUTCDay();
};
