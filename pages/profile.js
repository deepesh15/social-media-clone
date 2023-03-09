import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { useRouter } from 'next/router';
import FriendInfo from '@/components/FriendInfo';
import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Cover from '@/components/Cover';

export default function ProfilePage() {
	const [profile, setProfile] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [name, setName] = useState('');
	const [place, setPlace] = useState('');
	const router = useRouter();
	const session = useSession();
	const userId = router.query.id;
	const { asPath: pathname } = router;
	const supabaseClient = useSupabaseClient();

	const fetchUser = () => {
		supabaseClient
			.from('profiles')
			.select()
			.eq('id', userId)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				if (res.data) {
					setProfile(res.data[0]);
				}
			});
	};

	const saveProfile = () => {
		supabaseClient
			.from('profiles')
			.update({ name, place })
			.eq('id', session.user.id)
			.then((res) => {
				if (!res.error) {
					setProfile((prev) => ({ ...prev, name, place }));
				}
				setEditMode(false);
			});
	};

	useEffect(() => {
		if (!userId) {
			return;
		}
		fetchUser();
	}, [userId]);

	const isPosts = pathname.includes('posts') || pathname === '/profile';
	const isFriends = pathname.includes('friends');
	const isPhotos = pathname.includes('photos');
	const isAbout = pathname.includes('about');
	const tabClasses = 'flex gap-2 items-center px-2 py-3 border-b-2 border-b-white transition-all hover:border-b-socialBlue hover:text-socialBlue';
	const activeTabClasses = 'flex gap-2 items-center px-2 py-3  border-b-socialBlue text-socialBlue border-b-2';
	const isMyUser = userId === session?.user?.id;
	return (
		<Layout>
			<Card noPadding={true}>
				<div className='relative overflow-hidden rounded-md'>
					<Cover url={profile?.cover} editable={isMyUser} onChange={fetchUser} />
					<div className='absolute top-24 left-4 z-10'>{profile && <Avatar url={profile.avatar} editable={isMyUser} onChange={fetchUser} size={'lg'} />}</div>
					<div className='p-4 pt-0 md:pt-4 pb-0  '>
						<div className='ml-24 md:ml-40 flex justify-between '>
							<div>
								{editMode && (
									<div>
										<input type='text' className='border py-2 px-3 rounded-md' placeholder={'Your name'} onChange={(ev) => setName(ev.target.value)} value={name} />
									</div>
								)}
								{!editMode && <h1 className='text-xl font-bold'>{profile?.name}</h1>}

								{editMode && (
									<div>
										<input type='text' className='border py-2 px-3 rounded-md' placeholder={'Your place'} onChange={(ev) => setPlace(ev.target.value)} value={place} />
									</div>
								)}
								{!editMode && <p className='text-gray-500 leading-4'>{profile?.place || 'Internet'}</p>}
							</div>

							{isMyUser && !editMode && (
								<div className='flex items-center gap-1 cursor-pointer bg-white p-2 shadow-md rounded-md  transition-all hover:text-socialBlue'>
									<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
										<path strokeLinecap='round' strokeLinejoin='round' d='M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' />
									</svg>
									<button
										onClick={() => {
											setEditMode(true);
											setName(profile.name);
											setPlace(profile.place);
										}}>
										Edit profile
									</button>
								</div>
							)}

							{isMyUser && editMode && (
								<div>
									<button onClick={saveProfile} className='flex cursor-pointer m-1 p-1 bg-white shadow-md rounded-md  transition-all hover:text-socialBlue'>
										<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
											<path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
										</svg>
									</button>
									<button onClick={() => setEditMode(false)} className='flex cursor-pointer m-1 p-1 bg-white  shadow-md rounded-md  transition-all hover:text-socialBlue'>
										<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
											<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
								</div>
							)}
						</div>
						<div className='mt-2 md:mt-5 flex gap-5 justify-between'>
							<Link href={'/profile/posts'} className={isPosts ? activeTabClasses : tabClasses}>
								<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122' />
								</svg>
								<span className='hidden md:block'>Posts</span>
							</Link>
							<Link href={'/profile/friends'} className={isFriends ? activeTabClasses : tabClasses}>
								<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' />
								</svg>
								<span className='hidden md:block'>Friends</span>
							</Link>
							<Link href={'/profile/photos'} className={isPhotos ? activeTabClasses : tabClasses}>
								<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' />
								</svg>
								<span className='hidden md:block'>Photos</span>
							</Link>
							<Link href={'/profile/about'} className={isAbout ? activeTabClasses : tabClasses}>
								<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
								</svg>
								<span className='hidden md:block'>About</span>
							</Link>
						</div>
					</div>
				</div>
			</Card>
			{isPosts && (
				<div>
					<PostCard />
				</div>
			)}
			{isFriends && (
				<div>
					<Card>
						<div>
							<h2 className='text-2xl mb-2'>Friends</h2>
						</div>
						<div className='grid gap-4 grid-cols-2 '>
							<div className='border-b border-b-gray-100  p-4 -mx-4'>
								<FriendInfo />
							</div>
							<div className='border-b border-b-gray-100 p-4 -mx-4'>
								<FriendInfo />
							</div>
							<div className='border-b border-b-gray-100 p-4 -mx-4'>
								<FriendInfo />
							</div>
							<div className='border-b border-b-gray-100 p-4 -mx-4'>
								<FriendInfo />
							</div>
							<div className='border-b border-b-gray-100 p-4 -mx-4'>
								<FriendInfo />
							</div>
							<div className='border-b border-b-gray-100 p-4 -mx-4'>
								<FriendInfo />
							</div>
						</div>
					</Card>
				</div>
			)}
			{isPhotos && (
				<div>
					<Card>
						<div className='grid md:grid-cols-2 md:gap-2 -mx-2 -my-2'>
							<div className=''>
								<div className='shadow-md overflow-hidden rounded-md mb-2'>
									<img src='https://images.unsplash.com/photo-1677629322702-facd25e7d55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60' alt='' />
								</div>
								<div className='shadow-md overflow-hidden rounded-md mb-2'>
									<img src='https://images.unsplash.com/photo-1677856217391-838a585c8290?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' alt='' />
								</div>
								<div className='shadow-md overflow-hidden rounded-md mb-2'>
									<img src='https://images.unsplash.com/photo-1677864234709-bde08838fb9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' alt='' />
								</div>
							</div>
							<div className=''>
								<div className='shadow-md overflow-hidden rounded-md mb-2'>
									<img src='https://images.unsplash.com/photo-1678001965135-675f0fd9e1f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' alt='' />
								</div>
								<div className='shadow-md overflow-hidden rounded-md mb-2'>
									<img src='https://images.unsplash.com/photo-1677980102989-96e7c29731f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60' alt='' />
								</div>
								<div className='shadow-md overflow-hidden rounded-md mb-2'>
									<img src='https://images.unsplash.com/photo-1677944632559-08c496a31184?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736&q=80' alt='' />
								</div>
							</div>
						</div>
					</Card>
				</div>
			)}
			{isAbout && (
				<div>
					<Card>
						<h2 className='text-2xl mb-2'>About</h2>
						<p className='mb-2 text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, rerum ullam, adipisci excepturi nihil veniam assumenda possimus fugit magnam blanditiis harum esse animi? Et consectetur vero nulla? Doloremque, laudantium blanditiis.</p>
						<p className='mb-2 text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nobis reprehenderit repellendus esse in quisquam totam earum velit minus voluptatibus optio ex, fugit ullam tempore natus aliquam veniam libero! Quod?</p>
					</Card>
				</div>
			)}
		</Layout>
	);
}
