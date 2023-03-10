import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { UserContextProvider } from '@/contexts/UserContext';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function SavedPosts() {
	const [posts, setPosts] = useState([]);
	const session = useSession();
	const supabaseClient = useSupabaseClient();

	useEffect(() => {
		if (!session?.user?.id) {
			return;
		}
		supabaseClient
			.from('saved_posts')
			.select('post_id')
			.eq('user_id', session.user.id)
			.then((res) => {
				const postsIds = res.data.map((item) => item.post_id);
				console.log(postsIds);
				supabaseClient
					.from('posts')
					.select('*,profiles(*)')
					.in('id', postsIds)
					.then((result) => setPosts(result.data));
			});
	}, [session?.user?.id]);

	return (
		<Layout>
			<UserContextProvider>
				<h2 className='text-2xl mb-2 font-bold text-gray-400'>Your saved posts</h2>
				{posts.length > 0 &&
					posts.map((post) => (
						<div key={post.id}>
							<PostCard {...post} />
						</div>
					))}
			</UserContextProvider>
		</Layout>
	);
}
