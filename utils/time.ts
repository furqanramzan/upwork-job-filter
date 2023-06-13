export function getStringFromTime(time: Date): string {
  const currentDateTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDateTime.getTime() - time.getTime();

  // Map the time units to milliseconds
  const unitMapping: { [key: string]: number } = {
    second: 1000,
    min: 60000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000, // Assuming 30 days per month
    year: 31536000000, // Assuming 365 days per year
  };

  // Find the largest time unit that can represent the time difference
  let largestUnit = 'second';
  let largestValue = Math.abs(timeDifference / unitMapping.second);

  for (const unit in unitMapping) {
    const value = Math.abs(timeDifference / unitMapping[unit]);
    if (value >= 1 && value < largestValue) {
      largestUnit = unit;
      largestValue = value;
    }
  }

  // Calculate the numeric value of the time unit
  const numericValue = Math.round(largestValue);

  // Construct the string representation of the time
  let timeString = `${numericValue} ${largestUnit}`;

  // Pluralize the unit if necessary
  if (numericValue !== 1) {
    timeString += 's';
  }

  timeString += ' ago';

  return timeString;
}
