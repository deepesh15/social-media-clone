import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Link from 'next/link';

export default function Notifications() {
	return (
		<Layout>
			<h2 className='text-2xl mb-2 font-bold text-gray-400'>Notifications</h2>
			<Card>
				<div className=''>
					<div className='flex p-2 gap-2 items-center border-b border-b-gray-100'>
						<Link href={'/profile'}>
							<Avatar />
						</Link>
						<div>
							<Link href={'/profile'} className='font-semibold mr-1 hover:underline'>
								John doe
							</Link>
							liked
							<Link href={'/photo'} className='text-socialBlue ml-1 hover:underline'>
								your photo
							</Link>
						</div>
					</div>
					<div className='flex p-2 gap-2 items-center border-b border-b-gray-100'>
						<Link href={'/profile'}>
							<Avatar />
						</Link>
						<div>
							<Link href={'/profile'} className='font-semibold mr-1 hover:underline'>
								John doe
							</Link>
							liked
							<Link href={'/photo'} className='text-socialBlue ml-1 hover:underline'>
								your photo
							</Link>
						</div>
					</div>
					<div className='flex p-2 gap-2 items-center border-b border-b-gray-100'>
						<Link href={'/profile'}>
							<Avatar />
						</Link>
						<div>
							<Link href={'/profile'} className='font-semibold mr-1 hover:underline'>
								John doe
							</Link>
							liked
							<Link href={'/photo'} className='text-socialBlue ml-1 hover:underline'>
								your photo
							</Link>
						</div>
					</div>
				</div>
			</Card>
		</Layout>
	);
}
