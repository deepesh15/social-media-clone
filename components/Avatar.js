export default function Avatar({ size }) {
	let width = 'w-14';
	size === 'lg' ? (width = 'w-24 md:w-36') : width;
	return (
		<div className={`${width} rounded-full overflow-hidden`}>
			<img src='https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60' />
		</div>
	);
}
