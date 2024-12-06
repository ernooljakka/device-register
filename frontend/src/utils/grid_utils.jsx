// Utils for grids.

export const formatEventData = (data) => {
    return data.map(event => ({
      ...event,
      // Format move_time to DD/MM/YYYY HH:MM:SS
      move_time: new Date(event.move_time.replace(' ', 'T') + 'Z').toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    }));
  };
  
// Tells AG-Grid how to filter EU-formatted datetimes by date
export const dateFilterParams = {
comparator: (filterLocalDateAtMidnight, cellValue) => {
    if (!cellValue) return -1;

    const [day, month, year] = cellValue
    .match(/(\d{2})\/(\d{2})\/(\d{4})/)
    .slice(1)
    .map(Number);

    const cellDate = new Date(year, month - 1, day);

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
    return 0;
    }
    return cellDate < filterLocalDateAtMidnight ? -1 : 1;
},
minValidYear: 2024,
};

// Tells AG-Grid how to compare dates for sorting by full dateTime
export const dateTimeComparator = (valueA, valueB) => {
  if (!valueA || !valueB) return 0;

  const parseDateTime = (value) => {
    const [datePart, timePart] = value.split(', ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute] = (timePart || '00:00').split(':').map(Number); 
    return new Date(year, month - 1, day, hour, minute, 0); 
  };

  const dateA = parseDateTime(valueA);
  const dateB = parseDateTime(valueB);

  return dateA - dateB; 
};

export const getRowStyle = () => {
  return { cursor: 'pointer' };
};