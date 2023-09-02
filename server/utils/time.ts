export function getTimeFromString(timeString: string): Date {
  const currentDateTime = new Date();

  // Extract the numeric value and unit from the time string
  const [value, unit] = timeString.split(' ');

  // Map the time units to milliseconds
  const unitMapping: { [key: string]: number } = {
    sec: 1000,
    second: 1000,
    min: 60000,
    minute: 60000,
    hr: 3600000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000, // Assuming 30 days per month
    year: 31536000000, // Assuming 365 days per year
  };

  // Calculate the time by subtracting the milliseconds from the current date and time
  const calculatedTime =
    currentDateTime.getTime() - Number(value) * unitMapping[unit];

  // Create a new Date object with the calculated time
  const time = new Date(calculatedTime);

  return time;
}

export function isDateNotOlderThanMinutes(
  date: Date,
  minutes: number,
): boolean {
  const minutesAgo = new Date();
  minutesAgo.setMinutes(minutesAgo.getMinutes() - minutes);

  return date > minutesAgo;
}
