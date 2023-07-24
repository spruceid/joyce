import { writable, type Writable } from 'svelte/store';

export interface IAlert {
  message: string;
  variant: 'error' | 'warning' | 'success' | 'info';
}

export const showAlert: Writable<IAlert | null> = writable(null);
