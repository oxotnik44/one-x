import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function classNames(...inputs: Parameters<typeof clsx>) {
    return twMerge(clsx(...inputs));
}
