import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../../app/api/apiSlice";

const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id, // Extract the _id field as the unique identifier
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //! GET POST BY ...
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    getPost: builder.query({
      query: (id) => ({
        url: `/posts/find/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return postsAdapter.setOne(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts/user/${id}`,
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    getPostsByTagId: builder.query({
      query: (id) => `/posts/tag/${id}`,
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
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
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
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
          date: new Date().toISOString(),
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
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetPostsByUserIdQuery,
  useGetPostsByTagIdQuery,
  useSearchPostQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedApiSlice;

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(selectPostsResult, (postsResult) => postsResult.data);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);
