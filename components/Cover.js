import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import Preloader from './Preloader';
import uploadUserProfileImage from '../helpers/user';

export default function Cover({ url, editable, onChange }) {
	const supabaseClient = useSupabaseClient();
	const session = useSession();
	const [isUploading, setIsUploading] = useState(false);

	const updateCover = async (event) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploading(true);
			await uploadUserProfileImage(supabaseClient, session.user.id, file, 'covers', 'cover');
			setIsUploading(false);
			if (onChange) onChange();
		}
	};

	return (
		<div className='h-40 overflow-hidden flex justify-center items-center relative'>
			<div>
				<img src={url} />
			</div>
			{isUploading && (
				<div className='absolute inset-0 bg-white bg-opacity-50 flex items-center z-10'>
					<div className='inline-block mx-auto'>
						<Preloader />
					</div>
				</div>
			)}
			{editable && (
				<div className='absolute right-0 bottom-0 m-2'>
					<label className='flex p-2 bg-white  shadow-md shadow-gray-400 cursor-pointer rounded-full z-10 transition-all hover:text-socialBlue'>
						<input type='file' className='hidden' onChange={updateCover} />
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' />
						</svg>
					</label>
				</div>
			)}
		</div>
	);
}
