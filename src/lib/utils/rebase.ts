import type { Types } from '@spruceid/rebase-client';
import type { ethers } from 'ethers';

/* CREDENTIALS */
export interface Subject {
  pkh: {
    eip155: {
      address: string;
      chain_id: string;
    };
  };
}

export enum CredentialTypesEnum {
  BasicProfileAttestation = 'BasicProfileAttestation',
  BasicTagAttestation = 'BasicTagAttestation',
  BookReviewAttestation = 'BookReviewAttestation',
  DappPreferencesAttestation = 'DappPreferencesAttestation',
  FollowAttestation = 'FollowAttestation',
  LikeAttestation = 'LikeAttestation',
  ProgressBookLinkAttestation = 'ProgressBookLinkAttestation'
}

export const allCredentialTypes: Array<Types.AttestationTypes> = [
  'BasicProfileAttestation',
  'BasicTagAttestation',
  'BookReviewAttestation',
  'DappPreferencesAttestation',
  'FollowAttestation',
  'LikeAttestation',
  'ProgressBookLinkAttestation'
];

export interface BaseCredentialContent {
  type: Types.AttestationTypes;
  // The DID of the user who is the credential subject, comes from the VC.credentialSubject.id
  subject: string;
  // The URN of the UUID of the credential.
  id: string;
  // The issuance date of the credential.
  issuanceDate: string;
}

export interface BasicProfile extends BaseCredentialContent {
  type: 'BasicProfileAttestation';
  description?: string;
  image?: string;
  username: string;
  website?: string;
}

export interface BookReview extends BaseCredentialContent {
  type: 'BookReviewAttestation';
  link: string;
  rating: number;
  review: string;
  title: string;
}

export interface DappPreferences extends BaseCredentialContent {
  type: 'DappPreferencesAttestation';
  dark_mode: boolean;
}

export interface Follow extends BaseCredentialContent {
  type: 'FollowAttestation';
  target: string;
}
export interface Like extends BaseCredentialContent {
  type: 'LikeAttestation';
  target: string;
}
export interface ProgressBookLink extends BaseCredentialContent {
  type: 'ProgressBookLinkAttestation';
  link: string;
  progress: number;
}

export type CredentialContent =
  | BasicProfile
  | BookReview
  | DappPreferences
  | Follow
  | Like
  | ProgressBookLink;

export type CredentialEntry = {
  jwt: string;
  content: CredentialContent;
};

export const encode = (c: string): string => {
  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
};

// TODO: Retype any to a credential type?
export const parseJWT = (jwt_str: string): any => {
  const v = jwt_str.split('.');

  if (v.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const u = v[1];
  const b64 = u.replace(/-/g, '+').replace(/_/g, '/');
  const encoded = atob(b64).split('').map(encode).join('');
  const json_str = decodeURIComponent(encoded);

  return JSON.parse(json_str);
};

export const toCredentialContent = (jwt_str: string): CredentialContent | void => {
  const parsed = parseJWT(jwt_str);
  const vc = parsed?.vc;
  if (!vc) {
    throw new Error('Malformed jwt, no vc property');
  }

  const t = vc?.type;
  if (!t) {
    throw new Error('Malformed credential, no type property');
  }

  if (t.length !== 2) {
    throw new Error('Malformed credential, type property did not have length of 2');
  }

  const credType = t[1];
  if (!allCredentialTypes.includes(credType)) {
    throw new Error(`Unsupported Credential Type: ${credType}`);
  }

  const credID = vc?.id;
  if (!credID) {
    throw new Error('No id property found under vc property in JWT credential');
  }

  const subjID = vc?.credentialSubject?.id;
  if (!subjID) {
    throw new Error('No id property found under vc.credentialSubject property in JWT credential');
  }

  const issuanceDate = vc?.issuanceDate;
  if (!issuanceDate) {
    throw new Error('No issuanceDate property found under vc property in JWT credential');
  }

  const c = {
    type: credType,
    id: credID,
    subject: subjID,
    issuanceDate
  };

  switch (credType as Types.AttestationTypes) {
    case 'BasicProfileAttestation': {
      let next: Partial<BasicProfile> = {
        username: getCredSubjProp('username', vc)
      };

      try {
        const description = getCredSubjProp('description', vc);
        next = Object.assign({}, next, { description });
      } catch (_e) {
        console.error(_e);
      }

      try {
        const image = getCredSubjProp('image', vc);
        next = Object.assign({}, next, { image });
      } catch (_e) {
        console.error(_e);
      }

      try {
        const website = getCredSubjProp('website', vc);
        next = Object.assign({}, next, { website });
      } catch (_e) {
        console.error(_e);
      }

      return Object.assign({}, c, next) as BasicProfile;
    }
    case 'BookReviewAttestation': {
      const next: Partial<BookReview> = {
        rating: getCredSubjProp('rating', vc),
        review: getCredSubjProp('review', vc),
        title: getCredSubjProp('title', vc),
        link: getCredSubjProp('link', vc)
      };

      return Object.assign({}, c, next) as BookReview;
    }
    case 'DappPreferencesAttestation': {
      let next;
      // NOTE: this is done to detect false booleans.
      // There may be a better way to do this if better typing were available.
      try {
        next = {
          dark_mode: getCredSubjProp('dark_mode', vc)
        };
      } catch (_e) {
        next = {
          dark_mode: false
        };
      }

      return Object.assign({}, c, next) as DappPreferences;
    }
    case 'FollowAttestation': {
      const next: Partial<Follow> = {
        target: getCredSubjProp('target', vc)
      };

      return Object.assign({}, c, next) as Follow;
    }
    case 'LikeAttestation': {
      const next: Partial<Like> = {
        target: getCredSubjProp('target', vc)
      };

      return Object.assign({}, c, next) as Like;
    }
    case 'ProgressBookLinkAttestation': {
      const next: Partial<ProgressBookLink> = {
        link: getCredSubjProp('link', vc)
      };
      try {
        next['progress'] = getCredSubjProp('progress', vc);
      } catch (_e) {
        next['progress'] = 0;
      }

      return Object.assign({}, c, next) as ProgressBookLink;
    }
  }
};

export const toCredentialEntry = (jwt_str: string): CredentialEntry => {
  const content = toCredentialContent(jwt_str);
  return { jwt: jwt_str, content: content as CredentialContent };
};

const getCredSubjProp = (prop: string, vc: any): any => {
  const x = vc?.credentialSubject[prop];
  if (!x) {
    throw new Error(
      `No ${prop} property found under vc.credentialSubject property in JWT credential`
    );
  }
  return x;
};

/* SIGNER */

export interface ISigner {
  id: string;
  sign: (statement: string) => Promise<string>;
  // disconnect: () => Promise<void>;
  toSubject: () => Promise<Subject>;
  web3Provider: ethers.providers.Web3Provider;
}

export class Signer implements ISigner {
  public id: string;
  public web3Provider: ethers.providers.Web3Provider;
  public signer: ethers.providers.JsonRpcSigner;

  constructor(id: string, web3Provider: ethers.providers.Web3Provider) {
    this.id = id;
    this.web3Provider = web3Provider;
    this.signer = web3Provider.getSigner();
  }

  sign = async (statement: string): Promise<string> => {
    const inner_ids = await this.web3Provider.listAccounts();
    if (this.id !== inner_ids[0]) {
      throw new Error(
        `Signer has changed on Provider's side, expected: ${this.id}, got ${inner_ids[0]}`
      );
    }
    return this.signer.signMessage(statement);
  };

  toSubject = async (): Promise<Subject> => {
    const inner_ids = await this.web3Provider.listAccounts();
    if (this.id !== inner_ids[0]) {
      throw new Error(
        `Signer has changed on Provider's side, expected: ${this.id}, got ${inner_ids[0]}`
      );
    }
    return {
      pkh: {
        eip155: {
          address: this.id,
          chain_id: '1'
        }
      }
    };
  };
}
