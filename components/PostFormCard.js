import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Avatar from './Avatar';
import Card from './Card';
export default function PostForm({ onPost }) {
	const [profile, setProfile] = useState();
	const [content, setContent] = useState('');
	const supabaseClient = useSupabaseClient();
	const session = useSession();

	useEffect(() => {
		supabaseClient
			.from('profiles')
			.select()
			.eq('id', session.user.id)
			.then((result) => {
				if (result.data.length) {
					setProfile(result.data[0]);
				}
			});
	}, []);

	const createPost = () => {
		supabaseClient
			.from('posts')
			.insert({
				author: session.user.id,
				content,
			})
			.then((response) => {
				if (!response.error) {
					setContent('');
					if (onPost) {
						onPost();
					}
				}
			});
	};

	//  add a spinner or something
	if (!profile) {
		return 'waiting for profile info';
	}
	return (
		<Card>
			<div className='flex gap-2 '>
				<div>
					<Avatar url={profile.avatar} />
				</div>
				<textarea value={content} onChange={(e) => setContent(e.target.value)} className='border rounded-lg grow p-3 h-14 resize-none' placeholder={`What's on your mind, ${profile.name}?`} />
			</div>
			<div className='flex gap-5 items-center mt-2 '>
				<div>
					<button className='flex gap-1'>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' />
						</svg>
						<span className='hidden md:block'>People</span>
					</button>
				</div>
				<div>
					<button className='flex gap-1'>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
							<path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
						</svg>
						<span className='hidden md:block'>Check-in</span>
					</button>
				</div>
				<div>
					<button className='flex gap-1'>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z' />
						</svg>
						<span className='hidden md:block'>Mood</span>
					</button>
				</div>
				<div className='grow text-right'>
					<button onClick={createPost} className='bg-socialBlue text-white px-6 py-1 rounded-md'>
						Share
					</button>
				</div>
			</div>
		</Card>
	);
}
