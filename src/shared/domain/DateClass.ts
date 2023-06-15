import moment from 'moment-timezone';

import { ValueObject } from './ValueObject';
import { Result } from '../core/Result';

moment.tz.setDefault('America/Sao_Paulo');

type GroupByPeriods = {
  label: string;
  startDate: DateClass;
  endDate: DateClass;
};

export interface DateProps {
  value: moment.Moment;
}

export class DateClass extends ValueObject<DateProps> {
  private get value(): moment.Moment {
    return this.props.value;
  }

  public toValue(): Date {
    return this.value.toDate();
  }

  public toPersistence(): Date {
    return this.value.toDate();
  }

  public toDTO(): string {
    return this.value.format('DD/MM/YYYY');
  }

  public toLongDTO(): string {
    return this.value.format('DD/MM/YYYY HH:mm:ss Z');
  }

  public isAfter(date: DateClass): boolean {
    return this.toTimestamp() > date.toTimestamp();
  }

  public isBefore(date: DateClass): boolean {
    return this.toTimestamp() < date.toTimestamp();
  }

  public isEqual(date: DateClass): boolean {
    return this.toTimestamp() === date.toTimestamp();
  }

  private constructor(props: DateProps) {
    super(props);
  }

  toTimestamp(): number {
    return this.value.valueOf();
  }

  public diffInSeconds(date: DateClass): number {
    return this.value.diff(date.toValue(), 'seconds');
  }

  public static create(date: string | number): DateClass {
    return new DateClass({ value: moment(date) });
  }

  public static fromDTO(date: string): Result<DateClass> {
    if (!date) {
      return Result.fail<DateClass>('No date');
    }

    if (!/^\d\d\/\d\d\/\d\d\d\d$/.test(date)) {
      return Result.fail<DateClass>('Invalid date');
    }

    const value = moment(date, 'DD/MM/YYYY');
    if (!value.isValid()) {
      return Result.fail<DateClass>('Invalid date');
    }
    return Result.ok<DateClass>(new DateClass({ value }));
  }

  public clone(): DateClass {
    return new DateClass({ value: moment(this.value.toDate()) });
  }

  public static now(): DateClass {
    return new DateClass({ value: moment() });
  }

  public static fromPersistence(date?: Date): Result<DateClass> {
    if (!date) return Result.fail<DateClass>('No date');
    return Result.ok<DateClass>(new DateClass({ value: moment(date) }));
  }

  public addYear(n?: number): DateClass {
    const years = n ?? 1;
    this.props.value.add(years, 'year');
    return this;
  }

  public addMonth(): DateClass {
    this.props.value.add(1, 'month');
    return this;
  }

  public addDay(n?: number): DateClass {
    const days = n ?? 1;
    this.props.value.add(days, 'days');
    return this;
  }

  public subtractHour(n?: number): DateClass {
    const hours = n ?? 1;
    this.props.value.subtract(hours, 'hours');
    return this;
  }

  public subtractDay(n?: number): DateClass {
    const days = n ?? 1;
    this.props.value.subtract(days, 'days');
    return this;
  }

  public startOfHour(): DateClass {
    this.props.value.startOf('hour');
    return this;
  }

  public endOfHour(): DateClass {
    this.props.value.endOf('hour');
    return this;
  }

  public startOfDay(): DateClass {
    this.props.value.startOf('day');
    return this;
  }

  public endOfDay(): DateClass {
    this.props.value.endOf('day');
    return this;
  }

  public startOfWeek(): DateClass {
    this.props.value.startOf('week');
    return this;
  }

  public endOfWeek(): DateClass {
    this.props.value.endOf('week');
    return this;
  }

  public startOfMonth(): DateClass {
    this.props.value.startOf('month');
    return this;
  }

  public endOfMonth(): DateClass {
    this.props.value.endOf('month');
    return this;
  }

  static dayHourLabels(): string[] {
    return [
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
    ];
  }

  static weekDayLabels(): string[] {
    return ['1', '2', '3', '4', '5', '6', '7'];
  }

  static monthLabels(start: DateClass, end: DateClass): Result<string[]> {
    const startInMilliseconds = start.value.valueOf();
    const endInMilliseconds = end.value.valueOf();

    if (startInMilliseconds > endInMilliseconds) {
      return Result.fail<string[]>('Start date should be before end date');
    }

    const durationInMs = endInMilliseconds - startInMilliseconds;
    const duration = moment.duration(durationInMs);
    const durationInMonths = duration.asMonths();

    const labels: string[] = [start.value.format('MM/YYYY')];
    for (let i = 1; i < durationInMonths; i++) {
      const newDate = moment(startInMilliseconds).add(i, 'months');
      labels.push(newDate.format('MM/YYYY'));
    }

    return Result.ok<string[]>(labels);
  }

  static dayDateLabels(start: DateClass, end: DateClass): Result<string[]> {
    const startInMilliseconds = start.value.valueOf();
    const endInMilliseconds = end.value.valueOf();

    const durationInMs = endInMilliseconds - startInMilliseconds;
    const duration = moment.duration(durationInMs);
    const durationInDays = duration.asDays();

    if (startInMilliseconds > endInMilliseconds) {
      return Result.fail<string[]>('Start date should be before end date');
    }

    const labels: string[] = [start.value.format('DD/MM/YYYY')];
    for (let i = 1; i <= durationInDays; i++) {
      const newDate = moment(startInMilliseconds).add(i, 'days');
      labels.push(newDate.format('DD/MM/YYYY'));
    }

    return Result.ok<string[]>(labels);
  }

  static getPeriodsByHour(
    start: DateClass,
    end: DateClass,
  ): Result<GroupByPeriods[]> {
    const startInMilliseconds = start.value.valueOf();
    const endInMilliseconds = end.value.valueOf();

    if (startInMilliseconds >= endInMilliseconds) {
      return Result.fail<GroupByPeriods[]>(
        'Start date should be before end date',
      );
    }

    const durationInMs = endInMilliseconds - startInMilliseconds;
    const duration = moment.duration(durationInMs);
    const durationInHours = duration.asHours();

    const labels: GroupByPeriods[] = [
      {
        label: start.value.format('DD/MM/YYYY HH:mm'),
        startDate: start.startOfHour().clone(),
        endDate: start.endOfHour().clone(),
      },
    ];
    for (let i = 1; i <= durationInHours; i++) {
      const newDate = moment(startInMilliseconds).add(i, 'hours');
      const newDateClass = new DateClass({ value: newDate });
      labels.push({
        label: newDate.format('DD/MM/YYYY HH:mm'),
        startDate: newDateClass.startOfHour().clone(),
        endDate: newDateClass.endOfHour().clone(),
      });
    }

    return Result.ok<GroupByPeriods[]>(labels);
  }

  static getPeriodsByDay(
    start: DateClass,
    end: DateClass,
  ): Result<GroupByPeriods[]> {
    const startInMilliseconds = start.value.valueOf();
    const endInMilliseconds = end.value.valueOf();

    if (startInMilliseconds >= endInMilliseconds) {
      return Result.fail<GroupByPeriods[]>(
        'Start date should be before end date',
      );
    }

    const durationInMs = endInMilliseconds - startInMilliseconds;
    const duration = moment.duration(durationInMs);
    const durationInDays = duration.asDays();

    const labels: GroupByPeriods[] = [
      {
        label: start.value.format('DD/MM/YYYY'),
        startDate: start.startOfDay().clone(),
        endDate: start.endOfDay().clone(),
      },
    ];
    for (let i = 1; i <= durationInDays; i++) {
      const newDate = moment(startInMilliseconds).add(i, 'days');
      const newDateClass = new DateClass({ value: newDate });
      labels.push({
        label: newDate.format('DD/MM/YYYY'),
        startDate: newDateClass.startOfDay().clone(),
        endDate: newDateClass.endOfDay().clone(),
      });
    }

    return Result.ok<GroupByPeriods[]>(labels);
  }

  static getPeriodsByWeek(
    start: DateClass,
    end: DateClass,
  ): Result<GroupByPeriods[]> {
    const startInMilliseconds = start.startOfWeek().value.valueOf();
    const endInMilliseconds = end.endOfWeek().value.valueOf();

    if (startInMilliseconds >= endInMilliseconds) {
      return Result.fail<GroupByPeriods[]>(
        'Start date should be before end date',
      );
    }

    const durationInMs = endInMilliseconds - startInMilliseconds;
    const duration = moment.duration(durationInMs);
    const durationInWeeks = duration.asWeeks();

    const labels: GroupByPeriods[] = [
      {
        label: start.startOfWeek().value.format('DD/MM/YYYY'),
        startDate: start.startOfWeek().clone(),
        endDate: start.endOfWeek().clone(),
      },
    ];
    for (let i = 1; i <= durationInWeeks; i++) {
      const newDate = moment(startInMilliseconds).add(i, 'weeks');
      const newDateClass = new DateClass({ value: newDate });
      labels.push({
        label: newDateClass.startOfWeek().value.format('DD/MM/YYYY'),
        startDate: newDateClass.startOfWeek().clone(),
        endDate: newDateClass.endOfWeek().clone(),
      });
    }

    return Result.ok<GroupByPeriods[]>(labels);
  }

  static getPeriodsByMonth(
    start: DateClass,
    end: DateClass,
  ): Result<GroupByPeriods[]> {
    const startInMilliseconds = start.startOfMonth().value.valueOf();
    const endInMilliseconds = end.endOfMonth().value.valueOf();

    if (startInMilliseconds >= endInMilliseconds) {
      return Result.fail<GroupByPeriods[]>(
        'Start date should be before end date',
      );
    }

    const durationInMs = endInMilliseconds - startInMilliseconds;
    const duration = moment.duration(durationInMs);
    const durationInWeeks = duration.asMonths();

    const labels: GroupByPeriods[] = [
      {
        label: start.startOfMonth().value.format('DD/MM/YYYY'),
        startDate: start.startOfMonth().clone(),
        endDate: start.endOfMonth().clone(),
      },
    ];
    for (let i = 1; i <= durationInWeeks; i++) {
      const newDate = moment(startInMilliseconds).add(i, 'months');
      const newDateClass = new DateClass({ value: newDate });
      labels.push({
        label: newDateClass.startOfMonth().value.format('DD/MM/YYYY'),
        startDate: newDateClass.startOfMonth().clone(),
        endDate: newDateClass.endOfMonth().clone(),
      });
    }

    return Result.ok<GroupByPeriods[]>(labels);
  }
}
