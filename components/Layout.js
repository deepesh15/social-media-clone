import NavigationCard from './NavigationCard';

export default function Layout({ children, hideNavigation }) {
	let rightColumnClasses = '';
	hideNavigation ? (rightColumnClasses += 'w-full') : (rightColumnClasses += 'mx-4 md:mx-0 md:w-8/12');
	return (
		<div className='md:flex mt-4 max-w-4xl mx-auto gap-6 mb-24 md:mb-0'>
			{!hideNavigation && (
				<div className='fixed md:static bottom-0 w-full -mb-5 md:-mb-0 md:w-4/12 z-10 md:z-0'>
					<NavigationCard />
				</div>
			)}
			<div className={rightColumnClasses}>{children}</div>
		</div>
	);
}
