import dayjs from 'dayjs';
import {TFunction} from "i18next";

export const formatTimeFromNow = (date: string | Date, t: TFunction): string => {
  const now = dayjs();
  const target = dayjs(date);

  const isFuture = target.isAfter(now);
  const prefix = isFuture ? 'time.future' : 'time.past';

  const years = Math.abs(now.diff(target, 'year'));
  if (years > 0) {
    return t(`${prefix}.year`, {count: years});
  }

  const months = Math.abs(now.diff(target, 'month'));
  if (months > 0) {
    return t(`${prefix}.month`, {count: months});
  }

  const days = Math.abs(now.diff(target, 'day'));
  if (days > 0) {
    return t(`${prefix}.day`, {count: days});
  }

  const hours = Math.abs(now.diff(target, 'hour'));
  if (hours > 0) {
    return t(`${prefix}.hour`, {count: hours});
  }

  const minutes = Math.abs(now.diff(target, 'minute'));
  if (minutes > 0) {
    return t(`${prefix}.minute`, {count: minutes});
  }

  return t(`${prefix}.now`);
};