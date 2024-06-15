import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';
import { Activity } from '@/models/activity.ts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (...activities: Activity[]) => {
  const duration = activities.reduce((acc, { start, finish }) => {
    const s = moment(start);
    const f = moment(finish ?? new Date());
    const duration = moment.duration(f.diff(s));

    return acc + duration.asSeconds();
  }, 0);

  const d = moment.duration(duration, 'seconds');

  const hours = Math.floor(d.asHours());
  const minutes = Math.ceil(d.asMinutes()) % 60;

  return `${hours}:${('0' + minutes).slice(-2)}`;
};
