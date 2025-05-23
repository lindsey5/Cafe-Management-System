export const formatDateTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const formatted = new Date(date).toLocaleString('en-US', options);
  const [month, day, yearAndTime] = formatted.split('/');
  const [year, time] = yearAndTime.split(', ');
  return `${year}-${month}-${day} (${time.replace(' ', '')})`;
}

export const formatDate = (input) => {
  const date = new Date(input + 'Z'); 
  return date.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}