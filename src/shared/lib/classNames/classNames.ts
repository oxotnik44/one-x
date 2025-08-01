import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const classNames = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(...inputs));
