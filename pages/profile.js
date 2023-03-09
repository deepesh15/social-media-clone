import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Cover from '@/components/Cover';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileContent from '@/components/ProfileContent';
import { UserContextProvider } from '@/contexts/UserContext';

export default function ProfilePage() {
	const [profile, setProfile] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [name, setName] = useState('');
	const [place, setPlace] = useState('');
	const router = useRouter();
	const tab = router?.query?.tab?.[0] || 'posts';
	const session = useSession();
	const userId = router.query.id;
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

	const isMyUser = userId === session?.user?.id;
	return (
		<Layout>
			<UserContextProvider>
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
							<ProfileTabs active={tab} userId={profile?.id} />
						</div>
					</div>
				</Card>
				<ProfileContent activeTab={tab} userId={userId} />
			</UserContextProvider>
		</Layout>
	);
}
