import PostsList from "./features/posts/PostsList"
import AddPostForm from "./features/posts/AddPostForm";
import './App.css'
import SinglePostPage from "./features/posts/SinglePostPage"
import EditPostForm from "./features/posts/EditPostForm";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";
import Layout from "./components/Layout"
import {Routes, Route, Navigate} from 'react-router-dom';

function App() {

  return (
    
      <Routes>
        <Route path="/"  element={<Layout />}>

            {/* serves as homepage for the website */}
            <Route index element={<PostsList />}/>

            <Route path="post">
              <Route index element={<AddPostForm />}/>
              <Route path=":postId" element={<SinglePostPage />}/>
              <Route path="edit/:postId" element={<EditPostForm />}/>
            </Route>



            <Route path="user">
                <Route index element={<UsersList />}/>
                <Route path=":userId" element={<UserPage/>}/>
            </Route>

            {/* Catch all - replace with 404 component if you need */}
            <Route path="*" element={<Navigate to ="/" replace/>}/>
        </Route>
      </Routes>
  )
}

export default App
