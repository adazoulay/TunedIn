import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { current } from "@reduxjs/toolkit";

const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id, // Extract the _id field as the unique identifier
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //! FEED TYPE
    getPosts: builder.query({
      query: (page = 1) => `/posts?page=${page}`,
      transformResponse: (responseData) => {
        if (responseData.message) {
          return;
        }
        return postsAdapter.addMany(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post", id })),
          ];
        } else return [{ type: "Post", id: "LIST" }];
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        for (const key in newItems.entities) {
          currentCache.entities[key] = newItems.entities[key];
        }
        currentCache.ids = currentCache.ids.concat(newItems.ids);
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        // console.log("currentArg", currentArg);
        // console.log("previousArg", previousArg);
        return currentArg?.page !== previousArg?.page;
      },
    }),
    getTrend: builder.query({
      query: (page = 1) => `/posts/trend/${page}`,
      transformResponse: (responseData) => {
        return postsAdapter.addMany(initialState, responseData);
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
      query: (page = 1) => `/posts/sub/${page}`,
      transformResponse: (responseData) => {
        return postsAdapter.addMany(initialState, responseData);
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
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    getPostsByTagId: builder.query({
      query: (id) => `/posts/tag/${id}`,
      transformResponse: (responseData) => {
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, id) => [{ type: "Post", id }],
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
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
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
    addView: builder.mutation({
      query: ({ id }) => ({
        url: `posts/view/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    //! Like Dislike
    likePost: builder.mutation({
      query: ({ id, newLikes }) => ({
        //! LIKE
        url: `/posts/like/${id}`,
        method: "PUT",
      }),
      async onQueryStarted({ id, newLikes }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getPosts", "getPosts", (draft) => {
            const post = draft.entities[id];
            if (post) post.likes = newLikes;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    unLikePost: builder.mutation({
      query: ({ id, newLikes }) => ({
        //! DISLIKE
        url: `/posts/unlike/${id}`,
        method: "PUT",
      }),
      async onQueryStarted({ id, newLikes }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getPosts", "getPosts", (draft) => {
            const post = draft.entities[id];
            if (post) post.likes = newLikes;
          })
        );
        try {
          await queryFulfilled;
        } catch {
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
  useAddViewMutation,
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
