import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostFormCard';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import LoginPage from './login';

export default function Home() {
	const supabase = useSupabaseClient();
	const session = useSession();
	const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		supabase
			.from('posts')
			.select('id,content,created_at,profiles(id,avatar,name)')
			.order('created_at', { ascending: false })
			.then((res) => {
				setPosts(res.data);
			});
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	if (!session) {
		return <LoginPage />;
	}
	return (
		<Layout>
			<PostForm onPost={fetchPosts} />
			{posts.length > 0 && posts.map((post) => <PostCard key={post.id} {...post} />)}
		</Layout>
	);
}
