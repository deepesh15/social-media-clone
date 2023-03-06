import Avatar from './Avatar';
export default function FriendInfo() {
	return (
		<div className='flex gap-3 items-center'>
			<Avatar />
			<div>
				<h2 className='font-bold text-lg'>Jane Doe</h2>
				<p className='text-sm'>31 mutual friends</p>
			</div>
		</div>
	);
}
