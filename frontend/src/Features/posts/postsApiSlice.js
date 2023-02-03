import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { current } from "@reduxjs/toolkit";

const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id, // Extract the _id field as the unique identifier
  sortCodmparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState();

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //! FEED TYPE
    getPosts: builder.query({
      query: ({ page = 1, type, source }) =>
        `/posts?page=${page}&type=${type}&source=${source}`,
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
      merge: (currentCache, newItems, arg) => {
        if (arg.arg.page > 1) {
          for (const key in newItems.entities) {
            currentCache.entities[key] = newItems.entities[key];
          }
          currentCache.ids = currentCache.ids.concat(newItems.ids);
        } else {
          currentCache.entities = newItems.entities;
          currentCache.ids = newItems.ids;
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        // console.log(currentArg, previousArg);
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg.type !== previousArg.type ||
          currentArg.source !== previousArg.source
        );
      },
    }),
    //! GET POST BY ...
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
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: "List" }], //! Check use to be arg.id
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
      // invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    //! Like Dislike
    likePost: builder.mutation({
      query: ({ id, userId }) => ({
        //! LIKE
        url: `/posts/like/${id}`,
        method: "PUT",
      }),
      async onQueryStarted({ id, userId }, { dispatch, queryFulfilled, getState }) {
        console.log("1");
        for (const { endpointName, originalArgs } of postsApiSlice.util.selectInvalidatedBy(
          getState(),
          [{ type: "Post", id }]
        )) {
          if (endpointName !== "getPosts") continue;
          console.log("2");
          const patchResult = dispatch(
            postsApiSlice.util.updateQueryData(endpointName, originalArgs, (draft) => {
              console.log("3", endpointName, originalArgs);
              const post = draft.entities[id];
              console.log(current(post));
              if (post) {
                console.log("mutating");
                post.likes = [...post.likes, userId];
              }
              console.log(current(post));
            })
          );
          try {
            await queryFulfilled;
            console.log(current(draft));
          } catch {
            patchResult.undo();
          }
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
          postsApiSlice.util.updateQueryData("getPosts", 1, (draft) => {
            console.log("UNLIKE");
            const post = draft.entities[id];
            console.log(current(draft));
            if (post) post.likes = newLikes;
            console.log(current(draft));
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
  useSearchPostQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddViewMutation,
  useLikePostMutation,
  useUnLikePostMutation,
} = postsApiSlice;

export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(selectPostsResult, (postsResult) => postsResult.data);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);
