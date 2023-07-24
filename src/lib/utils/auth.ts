import {
  _profile,
  _ssx,
  DEFAULT_ACCOUNT_AVATAR,
  profile,
  type ProfileData
} from '$lib/stores/auth.store';
import { getFromKepler, listKeplerFiles } from '$lib/stores/credentials.store';
import { CredentialTypesEnum, toCredentialContent } from './rebase';

export const fetchMyProfile = async (fileList: Array<string> = []) => {
  if (_ssx) {
    if (!fileList) {
      fileList = await listKeplerFiles();
    }
    fileList = fileList.filter((file: string) =>
      file.includes(CredentialTypesEnum.BasicProfileAttestation)
    );
    try {
      const data = await getFromKepler(
        `joyce/public/${CredentialTypesEnum.BasicProfileAttestation}`
      );
      const credentialData: any = toCredentialContent(data);
      const newProfileData: ProfileData = {
        ...(_profile as ProfileData),
        credential: credentialData,
        username:
          credentialData?.username ??
          _profile?.ens?.domain ??
          `${_profile?.address.slice(0, 6)}...${_profile?.address.slice(-6)}`,
        avatar: credentialData?.image ?? _profile?.ens?.avatarUrl ?? DEFAULT_ACCOUNT_AVATAR
      };
      profile.set(newProfileData);
    } catch (e) {
      const newProfileData: ProfileData = {
        ...(_profile as ProfileData),
        username:
          _profile?.ens?.domain ??
          `${_profile?.address.slice(0, 6)}...${_profile?.address.slice(-6)}`,
        avatar: _profile?.ens?.avatarUrl ?? DEFAULT_ACCOUNT_AVATAR
      };
      profile.set(newProfileData);
      console.error(e);
    }
  }
};

export const updateMyProfile = async (credential: any) => {
  if (_ssx) {
    const newProfileData: ProfileData = {
      ...(_profile as ProfileData),
      credential,
      username:
        credential?.username ??
        _profile?.ens?.domain ??
        `${_profile?.address.slice(0, 6)}...${_profile?.address.slice(-6)}`,
      avatar: credential?.image ?? _profile?.ens?.avatarUrl ?? DEFAULT_ACCOUNT_AVATAR
    };
    profile.set(newProfileData);
  }
};
