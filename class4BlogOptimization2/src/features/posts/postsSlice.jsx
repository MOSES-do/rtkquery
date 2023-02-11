import { createEntityAdapter} from "@reduxjs/toolkit"
import {sub} from 'date-fns'
import {apiSlice} from '../api/apiSlice'


const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})


const initialState = postsAdapter.getInitialState({});

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), {minutes:min++}).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                //rtkquery and entityAdapter to normalize state
                return postsAdapter.setAll(initialState, loadedPosts)
                //We pass loadedPosts into setAll and it normalisez our data
            },
            providesTags: (result, error, arg) => [
                {type: 'Post', id: 'LIST'},
                ...result.ids.map(id => ({type: 'Post', id}))
                //NOTE
                /*Any time we invalidate one of the LIST 
                    -Invalidate means - CREATE, UPDATE, DELETE
                    It auto fetches the list
                */
                

            ]
        }),

        getPostByUserId: builder.query({
            query: id =>  `/posts/?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                     if (!post?.date) post.date = sub(new Date(), {minutes:min++}).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
             providesTags: (result, error, arg) => {
                console.log(result);
                return [
                ...result.ids.map(id => ({type: 'Post', id}))
                ]
            }
        }),

        addNewPost: builder.mutation({
            query: initialPost => ({
                url : '/posts',
                method: 'POST',
                body: {
                    ...initialPost, 
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reaction: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee:0
                    }
                }
            }),
              invalidatesTags: [
                {type: 'Post', id: "LIST"}
              ]
        }),

        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Post', id: arg.id}
            ]
        }),

        deletePost: builder.mutation({
            query: ({id}) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: {id}
            }),
              invalidatesTags: (result, error, arg) => [
                {type: 'Post', id: arg.id}
            ]
        }),

        //optimistic update
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user ID somehow
                // so that a user can't do the same reaction more than once
                body: { reactions }
            }),
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch(
                    // updateQueryData takes three arguments: the name of the endpoint to update, the same cache key value used to identify the specific cached data, and a callback that updates the cached data.
                    extendedApiSlice.util.updateQueryData('getPosts', 'getPosts', draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    })
})

//Custom hooks based on methods created above
export const {
    useGetPostsQuery, 
    useGetPostByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice

