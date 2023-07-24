import type { SSX } from '@spruceid/ssx';
import { writable, type Writable } from 'svelte/store';

export const DEFAULT_ACCOUNT_AVATAR =
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export interface EnsData {
  domain: string;
  avatarUrl?: string;
}

export interface ProfileData {
  address: string;
  username?: string;
  avatar?: string;
  ens?: EnsData;
  credential?: any;
}

export let ssx: Writable<SSX | null> = writable(null);
export let _ssx: SSX | null = null;
ssx.subscribe((x) => (_ssx = x));

export const profile: Writable<ProfileData | null> = writable(null);
export let _profile: ProfileData | null = null;
profile.subscribe((x) => (_profile = x));

export type LoadingProfile = 'signIn' | 'createOrbit' | 'loading' | 'signOut' | false;

export const loadingProfile: Writable<LoadingProfile> = writable(false);
export let _loadingProfile: LoadingProfile = false;
loadingProfile.subscribe((x) => (_loadingProfile = x));

export const showLoader: Writable<boolean> = writable(false);
export let _showLoader: boolean = false;
showLoader.subscribe((x) => (_showLoader = x));
