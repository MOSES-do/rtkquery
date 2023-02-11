import {useGetUsersQuery} from '../users/usersSlice'
import {Link, useParams} from 'react-router-dom'
import { useGetPostByUserIdQuery } from '../posts/postsSlice'

//Checking to see if the User ID coming from the post data is the same as the User ID from the user data

const UserPage = () =>{
  const {userId} = useParams()

  const{
      user,  isLoading: isLoadingUser, isSuccess: isSuccessUser, isError: isErrorUser, error : errorUser,
  } = useGetUsersQuery('getUsers', {
    selectFromResult:({data, isLoading, isSuccess, isError, error}) => ({
      user: data?.entities[userId],
      isLoading,
      isSuccess,
      isError,
      error
    })
  })
// const {post, isLoading: isLoadingPosts, isSuccess} = useGetPostsQuery('getPosts', {
//         selectFromResult: ({data, isLoading, isSuccess}) =>({
//             post: data?.entities[postId],
//             isLoading,
//             isSuccess
//         })
//     })
    

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostByUserIdQuery(userId)

  


  let content;
  if(isLoading || isLoadingUser){
    content = <p>Loading...</p>
  } else if(isSuccess && isSuccessUser){
    const {ids, entities} = postsForUser
    //entities(object) has all the individual posts for a single user
  content =   ids.map(id =>(
    
          <li  key={id} >
              <Link to={`/post/${id}`}>{entities[id].title}</Link>
          </li>
    ))
  } else if(isError || isErrorUser){
    content = <p>{error || errorUser}</p>
  }
  

    return (
       <section>
        <h2>{user?.name}</h2>
        <ol>

         {content}
        </ol>
               </section>

    )

}

export default UserPage