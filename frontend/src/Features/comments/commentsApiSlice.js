import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { current } from "@reduxjs/toolkit";

const commentsAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = commentsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  //! QUERY
  endpoints: (builder) => ({
    getComments: builder.query({
      query: () => "/comments",
      transformResponse: (responseData) => {
        const loadedComments = responseData.map((comment) => {
          return comment;
        });
        return commentsAdapter.setAll(initialState, loadedComments);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Comment", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Comment", id })),
          ];
        } else return [{ type: "Comment", id: "LIST" }];
      },
    }),
    getCommentsByPostId: builder.query({
      query: (id) => ({
        url: `/comments/post/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return commentsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Comment", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Comment", id })),
          ];
        } else return [{ type: "Comment", id: "LIST" }];
      },
    }),
    //! MUTATION
    addNewComment: builder.mutation({
      query: ({ id, commentData }) => ({
        url: `/comments/${id}`,
        method: "POST",
        body: {
          userId: commentData.userId,
          username: commentData.username,
          desc: commentData.desc,
        },
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;
          const patchResult = dispatch(
            extendedApiSlice.util.updateQueryData("getCommentsByPostId", id, (draft) => {
              draft.entities[newComment._id] = newComment;
              draft.ids.unshift(newComment._id);
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
    deleteComment: builder.mutation({
      query: ({ id }) => ({
        url: `/comment/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg.id }],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetCommentsByPostIdQuery,
  useAddNewCommentMutation,
  useDeleteCommentMutation,
} = extendedApiSlice;

export const selectCommentsResult = extendedApiSlice.endpoints.getComments.select();

const selectCommentsData = createSelector(
  selectCommentsResult,
  (commentsResult) => commentsResult.data
);

export const {
  selectAll: selectAllComments,
  selectById: selectCommentById,
  selectIds: selectCommentIds,
} = commentsAdapter.getSelectors((state) => selectCommentsData(state) ?? initialState);
