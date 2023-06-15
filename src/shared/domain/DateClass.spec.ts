import { DateClass } from './DateClass';

import moment from 'moment-timezone';

describe('DateClass', () => {
  describe('Create dates', () => {
    it('should create a Date with the current date', () => {
      const now = DateClass.now();
      expect(now.toDTO()).toBe(moment().format('DD/MM/YYYY'));
    });

    it('should create a Date with timestamp', () => {
      const date = DateClass.create(1577847600000);
      expect(date.toDTO()).toBe('01/01/2020');
    });

    it('should create a Date with RFC 2822', () => {
      const date = DateClass.create('Fri, 31 Jan 2020 20:46:51 +0000');
      expect(date.toDTO()).toBe('31/01/2020');
    });

    it('should create a Date with ISO string', () => {
      const date = DateClass.create('2011-10-05T14:48:00.000Z');
      expect(date.toDTO()).toBe('05/10/2011');
    });

    it('should create a date from a JS Date object', () => {
      const fixedDate = new Date('2011-10-05T12:00:00');
      const date = DateClass.fromPersistence(fixedDate).getValue();
      expect(date.toDTO()).toBe('05/10/2011');
    });

    it('should not create a date from persistence if no input is given', () => {
      const dateOrError = DateClass.fromPersistence();
      expect(dateOrError.isFailure).toBe(true);
    });

    it('should create a date fromDTO string', () => {
      const dateOrError = DateClass.fromDTO('03/10/2020');
      expect(dateOrError.isFailure).toBe(false);
      const date = dateOrError.getValue();
      expect(date.toDTO()).toBe('03/10/2020');
    });

    it('should not create a date from DTO if empty string', () => {
      const dateOrError = DateClass.fromDTO('');
      expect(dateOrError.isFailure).toBe(true);
    });

    it('should not create an invalid date form DTO', () => {
      const dateOrError = DateClass.fromDTO('03/13/2020');
      expect(dateOrError.isFailure).toBe(true);
    });

    it('should not create a date from DTO if input string is not valid', () => {
      const dateOrError = DateClass.fromDTO('hello');
      expect(dateOrError.isFailure).toBe(true);
    });
  });

  describe('Clone dates', () => {
    it('should clone a date', () => {
      const original = DateClass.create('2011-10-05T12:00:00.000Z');
      const clone = original.clone();

      expect(original.equals(clone)).toBe(true);
      expect(original.toDTO()).toBe('05/10/2011');

      clone.addDay(5);
      expect(original.toDTO()).toBe('05/10/2011');
      expect(clone.toDTO()).toBe('10/10/2011');
    });
  });

  describe('Compare dates', () => {
    it('should verify if a date is before another', () => {
      const before = DateClass.create('2011-10-05T14:48:00.000Z');
      const after = DateClass.create('Fri, 31 Jan 2020 20:46:51 +0000');
      expect(before.isBefore(after)).toBe(true);
      expect(after.isBefore(before)).toBe(false);
    });

    it('should verify if a date is after another', () => {
      const before = DateClass.create('2011-10-05T14:48:00.000Z');
      const after = DateClass.create('Fri, 31 Jan 2020 20:46:51 +0000');
      expect(before.isAfter(after)).toBe(false);
      expect(after.isAfter(before)).toBe(true);
    });
  });

  describe('Getters', () => {
    it('should get a Date object from DateClass', () => {
      const date = DateClass.create('Fri, 31 Jan 2020 20:46:51 +0000');
      expect(date.toValue() instanceof Date).toBe(true);
    });

    it('should get a Date object for persistence', () => {
      const date = DateClass.create('Fri, 31 Jan 2020 20:46:51 +0000');
      expect(date.toPersistence() instanceof Date).toBe(true);
    });

    it('should get a long formatted string', () => {
      const date = DateClass.create('Fri, 31 Jan 2020 20:46:51 -0300');
      expect(date.toLongDTO()).toBe('31/01/2020 20:46:51 -03:00');
    });
  });

  describe('addYear', () => {
    it('should add one year by default to a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 -0300');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addYear();
      expect(date.toDTO()).toBe('20/01/2021');
    });

    it('should add multiple years to a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 -0300');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addYear(5);
      expect(date.toDTO()).toBe('20/01/2025');
    });

    it('should add zero years to a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 -0300');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addYear(0);
      expect(date.toDTO()).toBe('20/01/2020');
    });

    it('should subtract years', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 -0300');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addYear(-1);
      expect(date.toDTO()).toBe('20/01/2019');
    });

    it('should add one year to a date that does not exists in the following year', () => {
      //2020 is a leap year
      const date = DateClass.create('29 Feb 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('29/02/2020');

      date.addYear();
      expect(date.toDTO()).toBe('28/02/2021');
    });
  });

  describe('addMonth', () => {
    it('should add one month to a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addMonth();
      expect(date.toDTO()).toBe('20/02/2020');
    });

    it('should add one month to a date that does not exists in the following month', () => {
      const date = DateClass.create('30 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('30/01/2020');

      date.addMonth();
      //2020 is a leap year
      expect(date.toDTO()).toBe('29/02/2020');
    });
  });

  describe('addDay', () => {
    it('should add one day to a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addDay();
      expect(date.toDTO()).toBe('21/01/2020');
    });

    it('should add multiple days to a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addDay(5);
      expect(date.toDTO()).toBe('25/01/2020');
    });

    it('should subtract one day from a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addDay(-1);
      expect(date.toDTO()).toBe('19/01/2020');
    });

    it('should subtract multiple days from a date', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('20/01/2020');

      date.addDay(-5);
      expect(date.toDTO()).toBe('15/01/2020');
    });

    it('should change month when adding days', () => {
      const date = DateClass.create('30 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('30/01/2020');

      date.addDay(2);
      expect(date.toDTO()).toBe('01/02/2020');
    });

    it('should change month when subtracting days', () => {
      const date = DateClass.create('01 Feb 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('01/02/2020');

      date.addDay(-1);
      expect(date.toDTO()).toBe('31/01/2020');
    });

    it('should change year when adding days', () => {
      const date = DateClass.create('30 Dec 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('30/12/2020');

      date.addDay(2);
      expect(date.toDTO()).toBe('01/01/2021');
    });

    it('should change year when subtracting days', () => {
      const date = DateClass.create('01 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('01/01/2020');

      date.addDay(-1);
      expect(date.toDTO()).toBe('31/12/2019');
    });

    it('should handle leap years', () => {
      const leapYear = DateClass.create('28 Feb 2020 12:00:00 +0000');
      const nonLeapYear = DateClass.create('28 Feb 2021 12:00:00 +0000');

      expect(leapYear.toDTO()).toBe('28/02/2020');
      expect(nonLeapYear.toDTO()).toBe('28/02/2021');

      leapYear.addDay(1);
      nonLeapYear.addDay(1);
      expect(leapYear.toDTO()).toBe('29/02/2020');
      expect(nonLeapYear.toDTO()).toBe('01/03/2021');

      leapYear.addDay(1);
      nonLeapYear.addDay(1);
      expect(leapYear.toDTO()).toBe('01/03/2020');
      expect(nonLeapYear.toDTO()).toBe('02/03/2021');

      leapYear.addDay(-1);
      expect(leapYear.toDTO()).toBe('29/02/2020');
    });
  });

  describe('subtractHour', () => {
    //TODO: fix tests, we need to set the timezone to make this hour tests
    // consistent every where
    it('should subtract an hour from same day', () => {
      const date = DateClass.create('20 Jan 2020 12:00:00 +0000');
      const date2 = DateClass.create('20 Jan 2020 12:00:00 +0000');
      expect(date.toDTO()).toBe('20/01/2020');
      expect(date.isBefore(date2)).toBe(false);

      date.subtractHour();
      expect(date.toDTO()).toBe('20/01/2020');
      expect(date.isBefore(date2)).toBe(true);

      date.subtractHour(2);
      expect(date.toDTO()).toBe('20/01/2020');
      expect(date.isBefore(date2)).toBe(true);
    });
  });

  describe('change hours', () => {
    it('should go to the beginning of the day', () => {
      const date = DateClass.create('Fri, 31 Jan 2020 20:46:51 -0300');

      expect(date.toLongDTO()).toBe('31/01/2020 20:46:51 -03:00');

      date.startOfDay();

      expect(date.toLongDTO()).toBe('31/01/2020 00:00:00 -03:00');
    });

    it('should go to the end of the day', () => {
      const date = DateClass.create('Fri, 31 Jan 2020 20:46:51 -0300');

      expect(date.toLongDTO()).toBe('31/01/2020 20:46:51 -03:00');

      date.endOfDay();

      expect(date.toLongDTO()).toBe('31/01/2020 23:59:59 -03:00');
    });
  });

  describe('Labels', () => {
    it('should list all hours of the day labels', () => {
      const labels = DateClass.dayHourLabels();
      expect(labels).toEqual([
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ]);
    });

    it('should list all week day labels', () => {
      const labels = DateClass.weekDayLabels();
      expect(labels).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });

    it('should not list months labels if start date is after end date', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('08/01/2020').getValue();
      const labels = DateClass.monthLabels(start, end);
      expect(labels.isFailure).toBe(true);
    });

    it('should list month labels if start and end dates are the same', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('10/01/2020').getValue();
      const labels = DateClass.monthLabels(start, end);
      expect(start.equals(end)).toBe(true);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual(['01/2020']);
    });

    it('should list month labels if start is before end date, but in the same month', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('20/01/2020').getValue();
      const labels = DateClass.monthLabels(start, end);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual(['01/2020']);
    });

    it('should list month labels if start is before end date, in same year', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('20/02/2020').getValue();
      const labels = DateClass.monthLabels(start, end);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual(['01/2020', '02/2020']);
    });

    it('should list month labels if start is before end date, in another year', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('20/02/2021').getValue();
      const labels = DateClass.monthLabels(start, end);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual([
        '01/2020',
        '02/2020',
        '03/2020',
        '04/2020',
        '05/2020',
        '06/2020',
        '07/2020',
        '08/2020',
        '09/2020',
        '10/2020',
        '11/2020',
        '12/2020',
        '01/2021',
        '02/2021',
      ]);
    });

    it('should not list days labels if start date is after end date', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('08/01/2020').getValue();
      const labels = DateClass.dayDateLabels(start, end);
      expect(labels.isFailure).toBe(true);
    });

    it('should list days labels if start and end dates are the same', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('10/01/2020').getValue();
      const labels = DateClass.dayDateLabels(start, end);
      expect(start.equals(end)).toBe(true);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual(['10/01/2020']);
    });

    it('should list days labels if start and end dates are different but in the same day', () => {
      const start = DateClass.create('Fri, 10 Jan 2020 12:46:51 -0300');
      const end = DateClass.create('Fri, 10 Jan 2020 22:46:51 -0300');
      const labels = DateClass.dayDateLabels(start, end);
      expect(start.equals(end)).toBe(false);
      expect(start.isBefore(end)).toBe(true);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual(['10/01/2020']);
    });

    it('should list days labels if start and end are in the same month', () => {
      const start = DateClass.fromDTO('10/01/2020').getValue();
      const end = DateClass.fromDTO('12/01/2020').getValue();
      const labels = DateClass.dayDateLabels(start, end);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual([
        '10/01/2020',
        '11/01/2020',
        '12/01/2020',
      ]);
    });

    it('should list days labels if start and end are in different months', () => {
      const start = DateClass.fromDTO('30/01/2020').getValue();
      const end = DateClass.fromDTO('02/02/2020').getValue();
      const labels = DateClass.dayDateLabels(start, end);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual([
        '30/01/2020',
        '31/01/2020',
        '01/02/2020',
        '02/02/2020',
      ]);
    });
    it('should list days labels if start and end are in different years', () => {
      const start = DateClass.fromDTO('30/12/2019').getValue();
      const end = DateClass.fromDTO('02/01/2020').getValue();
      const labels = DateClass.dayDateLabels(start, end);
      expect(labels.isSuccess).toBe(true);
      expect(labels.getValue()).toEqual([
        '30/12/2019',
        '31/12/2019',
        '01/01/2020',
        '02/01/2020',
      ]);
    });
  });
});
