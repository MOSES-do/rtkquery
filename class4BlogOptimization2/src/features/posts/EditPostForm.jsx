import {useState} from 'react'
import { useSelector} from 'react-redux'
import { useGetPostsQuery, useUpdatePostMutation, useDeletePostMutation } from './postsSlice'
import {useParams, useNavigate} from 'react-router-dom'
import {useGetUsersQuery} from '../users/usersSlice'
import { useEffect } from 'react'

const EditPostForm = () => {
    const {postId} = useParams()
    const navigate = useNavigate()

    const [updatePost, {isLoading}] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()

    //select post id's 
    const {post, isLoading: isLoadingPosts, isSuccess} = useGetPostsQuery('getPosts', {
        selectFromResult: ({data, isLoading, isSuccess}) =>({
            post: data?.entities[postId],
            isLoading,
            isSuccess
        })
    })
    
    const {data:users, isSuccess: isSuccessUsers} = useGetUsersQuery('getUsers')

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(()=>{
        if(isSuccess){
            setTitle(post.title)
            setContent(post.body)
            setUserId(post.userId)
        }
    }, [isSuccess, post?.title, post?.body, post?.userId])

    if(isLoadingPosts) return <p>Loading...</p>

      if (!post) {
        return (
            <section>
                <h2>Post not found</h2>
            </section>
        )
    }

    const onTitleChanged = e =>setTitle(e.target.value)
    const onContentChanged = e =>setContent(e.target.value)
    const onAuthorChanged = e =>setUserId(Number(e.target.value))

    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () =>{
        if(canSave){
            try{
                await updatePost({id: post.id, title, body:content, userId}).unwrap()

                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)
            } catch(err){
                console.error("Failed to save the post", err)
            } 
        }
    }

    let usersOptions;
    if(isSuccessUsers){
       usersOptions = users.ids.map((id) => (
		<option key={id} value={id}>
			{users.entities[id].name}
		</option>
       ))
    }

    const onDeletePostClicked = async () =>{
        try{
            await deletePost({id: post.id}).unwrap()

            setTitle('')
                setContent('')
                setUserId('')
                navigate('/')
        } catch(err){
            console.error('Failed to delete the post', err)
        }
    }

  return (

    <section>
        <h2>Edit Post</h2>
        <form>
            <label htmlFor="postTitle">Post Title:</label>
            <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged}/>

            <label htmlFor="postAuthor">Author:</label>
            <select id="postAuthor" defaultValue={userId} onChange={onAuthorChanged}>
                <option value=""></option>
                {usersOptions}
            </select>

            <label htmlFor="postContent">Content:</label>
				<textarea
					id="postContent"
					name="postContent"
					value={content}
					onChange={onContentChanged}
				/>
				<button type="button" onClick={onSavePostClicked} disabled={!canSave}>
					Save Post
				</button>

                <button type="button" onClick={onDeletePostClicked} disabled={!canSave}>
					Delete Post
				</button>
        </form>
    </section>
  )
}

export default EditPostForm