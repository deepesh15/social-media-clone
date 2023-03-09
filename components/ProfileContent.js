import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Card from './Card';
import FriendInfo from './FriendInfo';
import PostCard from './PostCard';
export default function ProfileContent({ activeTab, userId }) {
	const [posts, setPosts] = useState([]);
	const [profile, setProfile] = useState(null);
	const supabaseClient = useSupabaseClient();

	const userPosts = async (userId) => {
		const { data, error } = await supabaseClient.from('posts').select('id,content,created_at,author').eq('author', userId);
		if (error) throw error;
		return data;
	};

	const userProfile = async (userId) => {
		const { data, error } = await supabaseClient.from('profiles').select().eq('id', userId);
		if (error) throw error;
		return data[0];
	};

	const loadPosts = async () => {
		const posts = await userPosts(userId);
		const profile = await userProfile(userId);
		setPosts(posts);
		setProfile(profile);
	};
	useEffect(() => {
		if (!userId) {
			return;
		}
		if (activeTab === 'posts') {
			loadPosts().then(() => {});
		}
	}, [userId]);

	return (
		<div>
			{activeTab === 'posts' && <div>{posts.length > 0 && posts.map((post) => <PostCard key={post.created_at} {...post} profiles={profile} />)}</div>}
			{activeTab === 'friends' && (
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
			{activeTab === 'photos' && (
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
			{activeTab === 'about' && (
				<div>
					<Card>
						<h2 className='text-2xl mb-2'>About</h2>
						<p className='mb-2 text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, rerum ullam, adipisci excepturi nihil veniam assumenda possimus fugit magnam blanditiis harum esse animi? Et consectetur vero nulla? Doloremque, laudantium blanditiis.</p>
						<p className='mb-2 text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nobis reprehenderit repellendus esse in quisquam totam earum velit minus voluptatibus optio ex, fugit ullam tempore natus aliquam veniam libero! Quod?</p>
					</Card>
				</div>
			)}
		</div>
	);
}
