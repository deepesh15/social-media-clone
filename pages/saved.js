import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';

export default function SavedPosts() {
	return (
		<Layout>
			<h2 className='text-2xl mb-2 font-bold text-gray-400'>Your saved posts</h2>

			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
		</Layout>
	);
}
