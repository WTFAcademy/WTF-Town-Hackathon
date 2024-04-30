import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import GenesisNFT from '@/contracts/GenesisNFT.json';
import { getAddress } from 'viem';
import { useEffect, useMemo } from 'react';

// TODO input nft info
const useMintNft = () => {
	const {
		data: hash,
		isSuccess,
		isPending,
		writeContractAsync,
	} = useWriteContract();
	const {
		isLoading,
		isSuccess: isMintSuccess,
		data: event,
	} = useWaitForTransactionReceipt({
		hash,
	});

	const loading = isPending || isLoading;
	const minted = isSuccess && isMintSuccess;
	const mint = async () => {
		await writeContractAsync({
			abi: GenesisNFT.abi,
			address: getAddress(GenesisNFT.address),
			functionName: 'mint',
		});
	};
	const tokenId = useMemo(() => {
		const hexValue = event?.logs?.[0]?.topics?.[3];
		return hexValue ? parseInt(hexValue, 16) + '' : '';
	}, [event]);

	useEffect(() => {
		if (minted) {
			localStorage.setItem(
				'WTF-GENESIS-NFT-MINTED-DATE',
				Date.now().toString(),
			);
		}
	}, [minted]);
	return {
		loading,
		minted,
		mint,
		tokenId,
		hash,
	};
};

export default useMintNft;
