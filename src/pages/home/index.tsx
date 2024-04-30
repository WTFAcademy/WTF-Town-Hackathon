import Button from '@/components/ui/Button.tsx';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/use-auth.ts';

const Home = () => {
	const navigate = useNavigate();
	const { isAuthed } = useAuth();

	const handleEnterRoom = () => {
		isAuthed ? navigate('/game') : navigate('/login');
	};

	return (
		<div className="relative overflow-hidden">
			<div className="relative flex justify-center w-full">
				<img src="/home/home-hero.jpg" className="min-w-[880px] sm:min-w-[1440px] w-full" alt="Hero Background" />
				<img src="/home/home-title.png" className="absolute h-auto w-[75%] sm:w-[524px] top-[30%] sm:top-48" alt="WTF Town" />
				<div className="absolute left-[50%] sm:top-12 top-4 flex h-10 w-full max-w-[1272px] px-9 translate-x-[-50%] items-center justify-end">
					<Link
						className="mx-[5px]"
						to="https://twitter.com/WTFdotTown"
						target="_blank"
					>
						<TwitterSvg></TwitterSvg>
					</Link>
					<Link
						className="mx-[5px]"
						to="https://github.com/WTFAcademy/WTF-Town"
						target="_blank"
					>
						<GithubSvg></GithubSvg>
					</Link>
					<button
						className="relative md:ml-[25px] ml-[15px] box-border rounded-full bg-white md:px-8 md:py-3 px-6 py-2 text-xs leading-none text-black"
						onClick={handleEnterRoom}
					>
						Play
					</button>
				</div>
			</div>
			<div className="relative w-full bg-gradient-to-b from-[#0E282E] to-[#0F181C] md:pb-[190px] pt-12 pb-20">
				<div className="relative md:h-[84px] h-[63px] bg-home-action bg-contain bg-repeat-x opacity-10 w-[5376px] infinite-scrolling"></div>

				<p className="relative md:mt-[88px] text-center md:text-[28px] text-[16px] mt-[66px] text-white">
					Preview Room is now online
				</p>

				<div className="relative mx-auto max-w-[1200px]">
					<img src="/home/home-room.png" alt="WTF Town" />
				</div>
				<div className="relative w-full mt-12 text-center md:mt-0">
					<Button
						className="md:h-[56px] md:w-[328px] text-white h-[42px] w-[246px] md:text-base text-sm"
						onClick={handleEnterRoom}
					>
						Enter the room
					</Button>
				</div>
			</div>
			<div className="relative w-full bg-black py-[107px]">
				<div className="flex flex-col items-center">
					<p className="text-xs text-[#9CA3AF]">Made with love by</p>
					<div className="mt-2 h-[60px] w-[141px] bg-wtf-logo bg-contain"></div>
				</div>
			</div>
		</div>
	);
};

const TwitterSvg = () => {
	return (
		<svg
			width="36"
			height="36"
			viewBox="0 0 36 36"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M29.9153 10.5987C29.0246 10.9927 28.0801 11.2514 27.113 11.3664C28.1316 10.7564 28.8937 9.7969 29.2573 8.6667C28.3006 9.23604 27.2518 9.63504 26.1598 9.85087C25.4255 9.06521 24.4522 8.54416 23.3913 8.36872C22.3303 8.19328 21.2411 8.37328 20.293 8.88073C19.3448 9.38819 18.5909 10.1947 18.1484 11.1748C17.706 12.1549 17.5997 13.2538 17.8461 14.3005C15.9059 14.2035 14.0078 13.6994 12.275 12.821C10.5422 11.9427 9.01359 10.7097 7.78831 9.2022C7.35465 9.94706 7.12676 10.7938 7.12798 11.6557C7.12798 13.3474 7.99015 14.8419 9.29798 15.7169C8.52333 15.6924 7.76573 15.4832 7.08831 15.1067V15.1662C7.08828 16.2931 7.47802 17.3852 8.19143 18.2575C8.90485 19.1297 9.89801 19.7284 11.0025 19.9519C10.2834 20.147 9.52932 20.1757 8.79748 20.0359C9.10889 21.0058 9.7159 21.8541 10.5335 22.4618C11.3511 23.0696 12.3383 23.4064 13.3568 23.425C12.3446 24.2201 11.1855 24.8077 9.94596 25.1545C8.7064 25.5012 7.41065 25.6002 6.13281 25.4457C8.36315 26.88 10.9594 27.6414 13.6111 27.639C22.5875 27.639 27.4945 20.2039 27.4945 13.7557C27.4945 13.5457 27.4898 13.3334 27.4805 13.1245C28.4353 12.4343 29.2594 11.5794 29.9141 10.5999"
				fill="white"
			/>
		</svg>
	);
};

const GithubSvg = () => {
	return (
		<svg
			width="36"
			height="36"
			viewBox="0 0 36 36"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M18.0013 6.33337C11.5554 6.33337 6.3346 11.5542 6.3346 18C6.33319 20.4491 7.10296 22.8363 8.53471 24.8232C9.96646 26.8101 11.9875 28.2958 14.3111 29.0694C14.8944 29.1709 15.1138 28.8209 15.1138 28.514C15.1138 28.2375 15.0986 27.3194 15.0986 26.3417C12.1679 26.8819 11.4096 25.6277 11.1763 24.9709C11.0444 24.6349 10.4763 23.6 9.98043 23.3224C9.5721 23.1042 8.98876 22.564 9.96526 22.55C10.8846 22.5349 11.5403 23.3959 11.7596 23.7459C12.8096 25.5099 14.4861 25.014 15.1569 24.7084C15.2596 23.95 15.5653 23.4402 15.9013 23.1485C13.3054 22.8569 10.5929 21.85 10.5929 17.3875C10.5929 16.1182 11.0444 15.0694 11.7888 14.2527C11.6721 13.961 11.2638 12.7652 11.9054 11.161C11.9054 11.161 12.8819 10.8542 15.1138 12.3557C16.0636 12.0925 17.0448 11.9602 18.0304 11.9625C19.0221 11.9625 20.0138 12.0932 20.9471 12.3557C23.1789 10.839 24.1554 11.161 24.1554 11.161C24.7971 12.7652 24.3888 13.961 24.2721 14.2527C25.0153 15.0694 25.4679 16.1042 25.4679 17.3875C25.4679 21.8652 22.7414 22.8569 20.1456 23.1485C20.5679 23.5125 20.9331 24.2125 20.9331 25.3069C20.9331 26.8667 20.9179 28.1209 20.9179 28.5152C20.9179 28.8209 21.1373 29.1849 21.7206 29.0682C24.0362 28.2861 26.0484 26.7976 27.4738 24.8121C28.8992 22.8267 29.6662 20.4442 29.6668 18C29.6668 11.5542 24.4459 6.33337 18.0001 6.33337"
				fill="white"
			/>
		</svg>
	);
};

export default Home;
