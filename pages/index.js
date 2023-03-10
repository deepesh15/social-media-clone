import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostFormCard';
import { UserContext } from '@/contexts/UserContext';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import LoginPage from './login';

export default function Home() {
	const supabaseClient = useSupabaseClient();
	const session = useSession();
	const [posts, setPosts] = useState([]);
	const [profile, setProfile] = useState([null]);

	useEffect(() => {
		fetchPosts();
	}, []);

	useEffect(() => {
		if (!session?.user?.id) {
			return;
		}
		supabaseClient
			.from('profiles')
			.select()
			.eq('id', session.user.id)
			.then((result) => {
				if (result.data.length) {
					setProfile(result.data[0]);
				}
			});
	}, [session?.user?.id]);

	const fetchPosts = () => {
		supabaseClient
			.from('posts')
			.select('id,content,created_at,photos,profiles(id,avatar,name)')
			.is('parent', null)
			.order('created_at', { ascending: false })
			.then((res) => {
				setPosts(res.data);
			});
	};

	if (!session) {
		return <LoginPage />;
	}
	return (
		<Layout>
			<UserContext.Provider value={{ profile }}>
				<PostForm onPost={fetchPosts} />
				{posts.length > 0 && posts.map((post) => <PostCard key={post.id} {...post} />)}
			</UserContext.Provider>
		</Layout>
	);
}
