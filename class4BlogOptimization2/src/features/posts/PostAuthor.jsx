import {useGetUsersQuery} from '../users/usersSlice'
import {Link} from "react-router-dom"

import React from 'react'

const PostAuthor = ({userId}) => {
    // const users = useSelector(selectAllUsers)
    // const author = users.find(user => user.id === userId)

    //select userid from users
    const {user:author} = useGetUsersQuery('getUsers', {
      selectFromResult: ({data, isLoading}) => ({
        user: data?.entities[userId]
      }),
    })
    
  return <span>by {author 
    ? 
    <Link to={ `/user/${userId}`}>{author.name}</Link>
     : 'Unknown author'}</span>
    
}

export default PostAuthor