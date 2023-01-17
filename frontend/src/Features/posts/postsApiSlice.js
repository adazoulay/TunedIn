import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { current } from "@reduxjs/toolkit";
import useAuth from "../../hooks/useAuth";

const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id, // Extract the _id field as the unique identifier
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //! FEED TYPE
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post", id })),
          ];
        } else return [{ type: "Post", id: "LIST" }];
      },
    }),
    getTrend: builder.query({
      query: () => "/posts/trend",
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post", id })),
          ];
        } else return [{ type: "Post", id: "LIST" }];
      },
    }),
    getSub: builder.query({
      query: () => "/posts/sub",
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post", id })),
          ];
        } else return [{ type: "Post", id: "LIST" }];
      },
    }),
    //! GET POST BY ...
    getPost: builder.query({
      query: (id) => ({
        url: `/posts/find/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return postsAdapter.setOne(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts/user/${id}`,
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    getPostsByTagId: builder.query({
      query: (id) => `/posts/tag/${id}`,
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    searchPost: builder.query({
      query: (str) => `/posts/search?q=${str}`,
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        if (!responseData) {
          return;
        }
        const loadedPosts = responseData.map((post) => {
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    //! MUTATE POST
    addNewPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...postData,
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    likePost: builder.mutation({
      query: ({ id, userId }) => ({
        //! LIKE
        url: `/posts/like/${id}`,
        method: "PUT",
      }),
      async onQueryStarted({ id, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.entities[id];
            if (current(post) && !current(post)?.likes.includes(userId)) {
              console.log("in 1");
              post.likes.push(userId);
            }
          })
        );
        try {
          console.log("1 try");
          await queryFulfilled;
          console.log("1 fulfilled");
        } catch {
          console.log("1 catch");
          patchResult.undo();
        }
      },
    }),
    unLikePost: builder.mutation({
      query: ({ id, userId }) => ({
        //! DISLIKE
        url: `/posts/unlike/${id}`,
        method: "PUT",
      }),
      async onQueryStarted({ id, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.entities[id];
            if (current(post) && current(post)?.likes.includes(userId)) {
              console.log("in 2");
              post.likes = post.likes.filter((id) => id !== userId);
            }
          })
        );
        try {
          console.log("2 try");
          await queryFulfilled;
          console.log("2 fulfilled");
        } catch {
          console.log("2 catch");
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetTrendQuery,
  useGetSubQuery,
  useGetPostQuery,
  useGetPostsByUserIdQuery,
  useGetPostsByTagIdQuery,
  useSearchPostQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnLikePostMutation,
} = extendedApiSlice;

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(selectPostsResult, (postsResult) => postsResult.data);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);
