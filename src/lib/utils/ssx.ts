import { showAlert } from '$lib/stores/alert.store';
import {
  loadingProfile,
  _ssx,
  ssx,
  profile,
  type ProfileData,
  showLoader
} from '$lib/stores/auth.store';
import { listKeplerFiles, signer as rebaseSigner } from '$lib/stores/credentials.store';
import { configureChains, createClient, disconnect, watchSigner } from '@wagmi/core';
import { mainnet, goerli } from '@wagmi/core/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { Signer } from './rebase';
import { fetchMyUserFollowingHandles, userFollowingHandles } from '$lib/stores/users.store';
import { myList, reviews } from '$lib/stores/book.store';
import { fetchAllReviews, fetchMyList } from './book';
import type { ethers } from 'ethers';

import { SSX } from '@spruceid/ssx';
import { fetchMyProfile } from './auth';

// 1. Define constants
const projectId = import.meta.env.VITE_PROJECT_ID;
const chains = [mainnet, goerli];

// 2. Configure wagmi client
const { provider } = configureChains(chains, [
  w3mProvider({
    projectId
  })
]);

const wagmiClient = createClient({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    version: 2,
    chains
  }),
  provider
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiClient, chains);

export const web3Modal = new Web3Modal(
  {
    projectId,
    walletImages: {
      safe: 'https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg'
    }
  },
  ethereumClient
);

export const SSXOpenWeb3Modal = () => {
  web3Modal.openModal();
};

export const unwatch = watchSigner({}, async (signer) => {
  if (signer) {
    // Sign in flow

    // We verify SSX here to prevent a new sign in when changing the account.
    if (_ssx) return;

    loadingProfile.set('signIn');

    showLoader.set(true);
    const SSXConfig = {
      enableDaoLogin: false,
      resolveEns: true,
      providers: {
        web3: {
          driver: signer.provider
        }
      },
      modules: {
        storage: {
          prefix: 'joyce',
          hosts: ['https://kepler.spruceid.xyz'],
          autoCreateNewOrbit: false
        }
      }
    };

    const ssxInstance = new SSX(SSXConfig);

    try {
      const res = await ssxInstance.signIn();
      (window as any).ssx = ssxInstance;

      ssx.set(ssxInstance);
      const signerId = await signer.getAddress();
      rebaseSigner.set(new Signer(signerId, signer.provider as ethers.providers.Web3Provider));

      const hasOrbit = await ssxInstance.storage.activateSession();
      showLoader.set(false);
      if (!hasOrbit) {
        loadingProfile.set('createOrbit');
      } else {
        await retrieveProfile();
      }
    } catch (err) {
      showLoader.set(false);
      showAlert.set({
        variant: 'error',
        message: err as string
      });
      console.error(err);
      disconnect();
    }
  } else {
    // Sign out flow
    showLoader.set(false);
    loadingProfile.set('signOut');
    try {
      await _ssx?.signOut();
    } catch (e) {
      // User rejected the connection after the wallet selection on web3modal
    }
    ssx.set(null);

    loadingProfile.set(false);
    profile.set(null);
    rebaseSigner.set(null);
    userFollowingHandles.set([]);
    reviews.set({});
    myList.set({});
  }
});

const retrieveProfile = async () => {
  showLoader.set(true);
  const fileList = await listKeplerFiles();

  const session = _ssx?.session();
  if (session) {
    const { address, ens } = session;
    const p: ProfileData = { address };

    if (ens && ens.domain) {
      p.ens = {
        domain: ens.domain
      };

      if (ens.avatarUrl) {
        p.ens.avatarUrl = ens.avatarUrl;
      }
    }
    profile.set(p);
  }

  fetchMyUserFollowingHandles(fileList);
  fetchAllReviews(fileList);
  fetchMyList(fileList);
  await fetchMyProfile(fileList);
  loadingProfile.set(false);
  showLoader.set(false);
};

export const createOrbitAndRetrieveProfile = async () => {
  try {
    showLoader.set(true);
    await _ssx?.storage.hostOrbit();
    showLoader.set(false);
    return retrieveProfile();
  } catch (err) {
    showLoader.set(false);
    showAlert.set({
      variant: 'error',
      message: err as string
    });
    console.error(err);
    disconnect();
  }
};

export const resolveEns = (address: string) => {
  if (!_ssx) {
    throw Error('You must be signed in');
  }
  return _ssx.resolveEns(address, { domain: true, avatar: true });
};
