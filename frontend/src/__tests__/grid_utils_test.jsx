import {  formatEventData, dateFilterParams, dateTimeComparator, getRowStyle } from "../utils/grid_utils";

describe('Grid Utils', () => {

  describe('formatEventData', () => {

    it('formats move_time to DD/MM/YYYY HH:MM in en-GB locale with local timezone', () => {
        const input = [
          { move_time: '2024-12-01 15:30:00' },
          { move_time: '2024-12-02 10:15:45' },
        ];
        
        // Test works regardless of machine timezone.
        const expectedOutput = input.map(event => ({  
          move_time: new Date(`${event.move_time.replace(' ', 'T')}Z`).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        }));
      
        const output = formatEventData(input);
      
        expect(output).toEqual(expectedOutput);
      });
      

    it('handles empty data gracefully', () => {
      const input = [];
      const output = formatEventData(input);

      expect(output).toEqual([]);
    });
  });

  describe('dateFilterParams', () => {
    const { comparator } = dateFilterParams;

    it('compares dates correctly', () => {
      const filterLocalDateAtMidnight = new Date(2024, 11, 1); 
      const cellValue = '01/12/2024';

      const result = comparator(filterLocalDateAtMidnight, cellValue);
      expect(result).toBe(0); 
    });

    it('returns -1 for earlier dates', () => {
      const filterLocalDateAtMidnight = new Date(2024, 11, 2);
      const cellValue = '01/12/2024';

      const result = comparator(filterLocalDateAtMidnight, cellValue);
      expect(result).toBe(-1); 
    });

    it('returns 1 for later dates', () => {
      const filterLocalDateAtMidnight = new Date(2024, 11, 1);
      const cellValue = '02/12/2024';

      const result = comparator(filterLocalDateAtMidnight, cellValue);
      expect(result).toBe(1);
    });

    it('returns -1 for invalid or empty cellValue', () => {
      const filterLocalDateAtMidnight = new Date(2024, 11, 1); 
      const result = comparator(filterLocalDateAtMidnight, null);
      expect(result).toBe(-1); 
    });
  });

  describe('dateTimeComparator', () => {
    it('compares two datetime strings correctly when the first is earlier', () => {
      const valueA = '01/12/2024, 15:30';
      const valueB = '02/12/2024, 10:15';
  
      const result = dateTimeComparator(valueA, valueB);
      expect(result).toBeLessThan(0);
    });
  
    it('returns 0 when datetime strings are equal (ignoring seconds)', () => {
      const valueA = '01/12/2024, 15:30';
      const valueB = '01/12/2024, 15:30';
  
      const result = dateTimeComparator(valueA, valueB);
      expect(result).toBe(0);
    });
  
    it('compares two datetime strings correctly when the first is later', () => {
      const valueA = '02/12/2024, 10:15';
      const valueB = '01/12/2024, 15:30';
  
      const result = dateTimeComparator(valueA, valueB);
      expect(result).toBeGreaterThan(0);
    });
  
    it('handles missing time by defaulting to midnight (00:00)', () => {
      const valueA = '01/12/2024'; 
      const valueB = '01/12/2024, 15:30';
  
      const result = dateTimeComparator(valueA, valueB);
      expect(result).toBeLessThan(0); 
    });
  });
  

  describe('getRowStyle', () => {
    it('returns correct row style', () => {
      const result = getRowStyle();
      expect(result).toEqual({ cursor: 'pointer' });
    });
  });
});
