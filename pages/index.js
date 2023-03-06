import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostFormCard';

export default function Home() {
	return (
		<Layout>
			<PostForm />
			<PostCard />
		</Layout>
	);
}
