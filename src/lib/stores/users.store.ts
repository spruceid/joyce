import { writable, type Writable } from 'svelte/store';
import { _ssx, type EnsData, type ProfileData } from './auth.store';
import { resolveEns } from '$lib/utils/ssx';
import { deleteFromKepler, listKeplerFiles } from './credentials.store';
import { CredentialTypesEnum } from '$lib/utils/rebase';

export const DEFAULT_USER_AVATAR =
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export interface UserData {
  address: string;
  username?: string;
  avatar?: string;
  ens?: EnsData;
  credential?: any;
}

export type Users = Record<string, UserData>;

export const users: Writable<Users> = writable({});
export let _users: Users = {};
users.subscribe((x) => (_users = x));

export const userFollowingHandles: Writable<Array<string>> = writable();
export let _userFollowingHandles: Array<string> = [];
userFollowingHandles.subscribe((x) => (_userFollowingHandles = x));

export const getUsersData = async (handles: Array<string>) => {
  const userData: Record<string, any> = {};
  const filteredHandles = [...new Set(handles)].filter((user) => !_users[user]);
  await Promise.all(filteredHandles.map((user) => resolveEns(user))).then((ensData) => {
    ensData.forEach((ens, i) => {
      userData[filteredHandles[i]] = {
        address: filteredHandles[i],
        ens
      };
    });
  });
  users.set({
    ..._users,
    ...userData
  });
};

export const fetchUserData = async (userHandle: string): Promise<ProfileData | undefined> => {
  if (_ssx) {
    try {
      const ens = (await _ssx.resolveEns(userHandle)) as EnsData;
      return {
        address: userHandle,
        ens
      };
    } catch (e) {
      console.error(e);
    }
  }
};

export const removeFollowing = async (userHandle: string) => {
  if (_ssx) {
    try {
      await deleteFromKepler(`joyce/public/${CredentialTypesEnum.FollowAttestation}/${userHandle}`);
      await fetchMyUserFollowingHandles();
    } catch (e) {
      console.error(e);
    }
  }
};

export const fetchMyUserFollowingHandles = async (fileList: Array<string> = []) => {
  if (_ssx) {
    try {
      if (!fileList) {
        fileList = await listKeplerFiles();
      }
      const following: Array<string> = fileList
        .filter((entry: string) => entry.includes(CredentialTypesEnum.FollowAttestation))
        .map((entry: string) => entry.split('/').pop() ?? '');
      userFollowingHandles.set(following);
    } catch (e) {
      console.error(e);
    }
  }
};

export const fetchUserFollowing = async (): Promise<Array<ProfileData> | undefined> => {
  if (_ssx) {
    try {
      const data = await listKeplerFiles();
      const following = data.filter((entry: string) =>
        entry.includes(CredentialTypesEnum.FollowAttestation)
      );
      const followingData: Array<ProfileData> = [];
      for (const vcPath of following) {
        const address = vcPath.split('/').pop() ?? '';
        const ens = await _ssx?.resolveEns(address);
        followingData.push({
          address,
          ens: {
            domain: ens?.domain ?? 'No ENS Domain',
            avatarUrl: ens?.avatarUrl ?? ''
          }
        });
      }
      return followingData;
    } catch (e) {
      console.error(e);
    }
  }
};
