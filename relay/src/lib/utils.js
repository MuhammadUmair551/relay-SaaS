import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AVATAR_COLORS = ['#1E2B0C', '#3D5420', '#6A8A3A',
    '#2E3D18', '#4A6A28', '#8AAA56',]

export function getAvatarColor(name = '') {
    const code = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export function getInitials(name = ''){
    return name.
    trim().split(' ').filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join('');
}

export function formatDate(dateStr){
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function daysUntil(dateStr){
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}