import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import Preloader from './Preloader';

export default function Cover({ url, editable, onChange }) {
	const supabaseClient = useSupabaseClient();
	const session = useSession();
	const [isUploading, setIsUploading] = useState(false);

	const updateCover = async (event) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploading(true);
			const newName = Date.now() + file.name;
			const { data, error } = await supabaseClient.storage.from('covers').upload(newName, file);

			if (error) throw error;
			if (data) {
				const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/covers/' + newName;
				const res = await supabaseClient.from('profiles').update({ cover: url }).eq('id', session.user.id);
				if (error) throw error;
				if (res && onChange) {
					onChange();
				}
			}
			setIsUploading(false);
		}
	};

	return (
		<div className='flex h-40 overflow-hidden  justify-center items-center '>
			<div>
				<img src={url} />
			</div>
			{isUploading && (
				<div className='absolute inset-0 bg-white bg-opacity-80 flex items-center z-10'>
					<div className='inline-block mx-auto'>
						<Preloader />
					</div>
				</div>
			)}
			{editable && (
				<div className='absolute right-2 top-1 rounded-md transition-all hover:fill-white hover:text-white'>
					<label>
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
