import { writable, type Writable } from 'svelte/store';
import { _ssx } from './auth.store';
import { getFromKepler } from './credentials.store';
import { CredentialTypesEnum } from '$lib/utils/rebase';

export const loading: Writable<boolean> = writable(false);
export let _loading: boolean;
loading.subscribe((x) => (_loading = x));

export const fetchDappPreferences = async () => {
  if (_ssx) {
    try {
      const data = await getFromKepler(
        `joyce/public/${CredentialTypesEnum.DappPreferencesAttestation}`
      );
      return data;
    } catch (e) {
      console.error(e);
    }
  }
};
