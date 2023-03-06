export default function Avatar({ size, url }) {
	let width = 'w-14';
	size === 'lg' ? (width = 'w-24 md:w-36') : width;
	return (
		<div className={`${width} rounded-full overflow-hidden`}>
			<img src={url} alt='profile-picture' />
		</div>
	);
}
