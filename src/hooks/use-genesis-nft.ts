import { useAccount, useReadContract } from 'wagmi';
import GenesisNFT from '@/contracts/GenesisNFT.json';
import { getAddress } from 'viem';
import { useMemo } from 'react';

const useGenesisNft = () => {
	const { address } = useAccount();
	const { data, isPending } = useReadContract({
		abi: GenesisNFT.abi,
		address: getAddress(GenesisNFT.address),
		functionName: 'balanceOf',
		args: [address],
	});

	const amount = useMemo(() => {
		return data ? Number(data.toString()) : 0;
	}, [data]);

	const isMinted = !!amount;

	return {
		data,
		isPending,
		amount,
		isMinted,
	};
};

export default useGenesisNft;
