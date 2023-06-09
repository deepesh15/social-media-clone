import Card from './Card';
import Avatar from './Avatar';
import ClickOutHandler from 'react-clickout-handler';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';
import { UserContext } from '@/contexts/UserContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import EmojiPicker from 'emoji-picker-react';

export default function PostCard({ id, content, photos, created_at, profiles: authorProfile }) {
	const [dropDownOpen, setDropDownOpen] = useState(false);
	const [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);
	const [commentText, setCommentText] = useState('');
	const [saved, setSaved] = useState(false);
	const [isDeletedPost, setDeletedPost] = useState(false);
	const { profile } = useContext(UserContext);
	const supabaseClient = useSupabaseClient();

	useEffect(() => {
		fetchLikes();
		fetchComments();
		if (profile?.id) fetchIsSaved();
	}, [profile?.id]);

	const fetchLikes = () => {
		supabaseClient
			.from('post_info')
			.select()
			.eq('post_id', id)
			.then((res) => {
				setLikes(res.data);
			});
	};

	const fetchComments = () => {
		supabaseClient
			.from('posts')
			.select('*,profiles(*)')
			.eq('parent', id)
			.then((res) => {
				setComments(res.data);
			});
	};

	const fetchIsSaved = () => {
		supabaseClient
			.from('saved_posts')
			.select()
			.eq('post_id', id)
			.eq('user_id', profile.id)
			.then((res) => {
				if (res.data.length > 0) {
					setSaved(true);
				} else {
					setSaved(false);
				}
			});
	};

	function openDropDown(e) {
		e.stopPropagation();
		setDropDownOpen(true);
	}

	function handleClickOutsideDropdown(e) {
		e.stopPropagation();
		setDropDownOpen(false);
	}

	const isLikedByMe = !!likes.find((like) => like.user_id === profile?.id);

	function toggleLike() {
		if (isLikedByMe) {
			supabaseClient
				.from('post_info')
				.delete()
				.eq('post_id', id)
				.eq('user_id', profile.id)
				.then(() => fetchLikes());
			return;
		}

		supabaseClient
			.from('post_info')
			.insert({ post_id: id, user_id: profile.id })
			.then(() => fetchLikes());
	}

	function toggleSave() {
		if (!saved) {
			supabaseClient
				.from('saved_posts')
				.insert({ user_id: profile.id, post_id: id })
				.then(() => {
					setDropDownOpen(false);
					setSaved(true);
				});
		}
		if (saved) {
			supabaseClient
				.from('saved_posts')
				.delete()
				.eq('user_id', profile.id)
				.eq('post_id', id)
				.then(() => {
					setSaved(false);
				});
		}
	}

	function postComment(ev) {
		ev.preventDefault();
		supabaseClient
			.from('posts')
			.insert({
				content: commentText,
				author: profile.id,
				parent: id,
			})
			.then((res) => {
				fetchComments();
				setCommentText('');
			});
	}

	const deletePost = async () => {
		// only delete it if the user is the one who posted it
		if (profile?.id === authorProfile?.id) {
			if (photos?.length > 0) {
				// if photos exists in post remove them from bucket
				const deletedPhotos = [];
				photos.map((photo) => {
					const [photo_name] = photo.split('/').slice(-1);
					deletedPhotos.push(photo_name);
				});
				const { error } = await supabaseClient.storage.from('photos').remove(deletedPhotos);
				if (error) {
					throw error;
				}
			}
			// delete from saved posts
			const { error: e } = await supabaseClient.from('saved_posts').delete().eq('post_id', id);
			if (e) {
				throw e;
			}

			// delete the likes
			const { error: er } = await supabaseClient.from('post_info').delete().eq('post_id', id);
			if (er) {
				throw er;
			}
			// delete the post itself
			const { error: err } = await supabaseClient.from('posts').delete().eq('id', id);
			if (err) {
				throw err;
			}
			setDeletedPost(true);
		}
	};

	const deleteComment = async (comment_id) => {
		const { error } = await supabaseClient.from('posts').delete().eq('id', comment_id);

		if (error) {
			throw error;
		}

		setComments(comments.filter((comment) => comment.id !== comment_id));
	};

	return (
		!isDeletedPost && (
			<Card>
				<div className='flex gap-3'>
					<div>
						<Link href={'/profile/' + authorProfile.id}>
							<span className='cursor-pointer'>
								<Avatar url={authorProfile.avatar} />
							</span>
						</Link>
					</div>
					<div className='grow'>
						<p>
							<Link href={'/profile/' + authorProfile.id}>
								<span className='mr-1 font-semibold hover:underline cursor-pointer'>{authorProfile.name}</span>
							</Link>{' '}
							shared a <a className='text-socialBlue'>post</a>
						</p>
						<p className='text-gray-500 text-sm'>
							<ReactTimeAgo date={Date.parse(created_at)}></ReactTimeAgo>
						</p>
					</div>
					<div className='relative'>
						<button className='text-gray-500' onClick={openDropDown}>
							<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
								<path strokeLinecap='round' strokeLinejoin='round' d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z' />
							</svg>
						</button>
						{dropDownOpen && <div className='bg-red w-5 h-5 absolute top-0'></div>}

						<ClickOutHandler onClickOut={handleClickOutsideDropdown}>
							<div className='relative z-20'>
								{dropDownOpen && (
									<div className='absolute right-2 bg-white shadow-md shadow-gray-300 p-3 rounded-md border border-gray-200 w-52'>
										<button onClick={toggleSave} className='block w-full'>
											{!saved && (
												<span className='flex gap-2 py-2 -mx-3 px-3 hover:bg-socialBg transition-all '>
													<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
														<path strokeLinecap='round' strokeLinejoin='round' d='M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z' />
													</svg>
													Save post
												</span>
											)}

											{saved && (
												<span className='flex gap-2 py-2 -mx-3 px-3 hover:bg-socialBg transition-all '>
													<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
														<path strokeLinecap='round' strokeLinejoin='round' d='M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5' />
													</svg>
													Unsave post
												</span>
											)}
										</button>
										<a href='' className='flex gap-2 py-2 -mx-3 px-3 hover:bg-socialBg transition-all '>
											<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
												<path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
											</svg>
											Hide post
										</a>

										<button onClick={deletePost} className='block w-full'>
											<span href='' className='flex gap-2 py-2 -mx-3 px-3 hover:bg-socialBg transition-all '>
												<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
													<path strokeLinecap='round' strokeLinejoin='round' d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' />
												</svg>
												Delete post
											</span>
										</button>

										<a href='' className='flex gap-2 py-2 -mx-3 px-3 hover:bg-socialBg transition-all '>
											<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
												<path strokeLinecap='round' strokeLinejoin='round' d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5' />
											</svg>
											Turn notifications
										</a>
										<a href='' className='flex gap-2 py-2 -mx-3 px-3 hover:bg-socialBg transition-all '>
											<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
												<path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' />
											</svg>
											Report post
										</a>
									</div>
								)}
							</div>
						</ClickOutHandler>
					</div>
				</div>
				<div>
					<p className='my-3 text-sm '>{content}</p>
					{photos?.length > 0 && (
						<div className='flex gap-4'>
							{photos.map((photo) => (
								<div key={photo}>
									<img className='  rounded-md overflow-hidden  ' src={photo} />{' '}
								</div>
							))}
						</div>
					)}

					<div className='flex mt-4 gap-8'>
						<button className='flex gap-1 items-center' onClick={toggleLike}>
							<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={'w-6 h-6 ' + (isLikedByMe ? 'fill-red-500' : '')}>
								<path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
							</svg>
							{likes?.length}
						</button>
						<button className='flex gap-1 items-center'>
							<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
								<path strokeLinecap='round' strokeLinejoin='round' d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' />
							</svg>
							{comments?.length}
						</button>
						{/* <button className='flex gap-1 items-center'>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z' />
						</svg>
						0
					</button> */}
					</div>
					<div className='flex mt-4 gap-3'>
						<div>
							<Avatar url={profile?.avatar} />
						</div>
						<div className='border grow rounded-lg relative'>
							<form onSubmit={postComment}>
								<input
									value={commentText}
									onChange={(ev) => {
										setCommentText(ev.target.value);
									}}
									className='w-full block rounded-lg p-3 px-4 h-12 overflow-hidden resize-none'
									placeholder='Leave a comment'
								/>
								
							</form>

							<button className='absolute top-3 right-3 text-gray-500'>
								<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' />
								</svg>
							</button>
						</div>
					</div>
					<div>
						{comments.length > 0 &&
							comments.map(
								(comment) =>
									!isDeletedPost[comment.id] && (
										<div key={comment.id} className='flex mt-2 items-center gap-4 w'>
											<Avatar url={comment.profiles.avatar} />
											<div className=' bg-socialBg py-2 px-4 rounded-3xl w-full'>
												<div className='flex justify-between'>
													<div>
														<Link href={'/profile/' + comment.author} className='font-medium hover:underline mr-2'>
															{comment.profiles.name}
														</Link>
														<span className='text text-gray-400'>
															<ReactTimeAgo date={Date.parse(comment.created_at)} timeStyle={'twitter'} />
														</span>
													</div>
													{comment.author === profile?.id && (
														<button
															onClick={() => {
																deleteComment(comment.id);
															}}>
															<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
																<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
															</svg>
														</button>
													)}
												</div>
												<p className='text-sm'>{comment.content}</p>
											</div>
										</div>
									),
							)}
					</div>
				</div>
			</Card>
		)
	);
}
