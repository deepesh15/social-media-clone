export default async function uploadUserProfileImage(supabaseClient, userId, file, bucket, columnName) {
	const newName = Date.now() + file.name;
	const { data, error } = await supabaseClient.storage.from(`${bucket}`).upload(newName, file);

	if (error) throw error;
	if (data) {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL + `/storage/v1/object/public/${bucket}/` + newName;
		await supabaseClient
			.from('profiles')
			.update({ [columnName]: url })
			.eq('id', userId);
		if (error) throw error;
	}
}
