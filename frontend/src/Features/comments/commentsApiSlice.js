import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const commentsAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = commentsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: () => "/comments",
      transformResponse: (responseData) => {
        const loadedComments = responseData.map((comment) => {
          return comment;
        });
        return commentsAdapter.setAll(initialState, loadedComments);
      },
      providesTags: (result, error, arg) => [
        { type: "Comment", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Comment", id })),
      ],
    }),
    getCommentsByPostId: builder.query({
      query: (id) => ({
        url: `/comments/post/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return commentsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "Comment", id })),
      ],
    }),
    addNewComment: builder.mutation({
      query: ({ id, desc }) => ({
        url: `/comments/${id}`,
        method: "POST",
        body: {
          desc,
        },
      }),
      async onQueryStarted({ id, desc }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getCommentsByPostId", id, (draft) => {
            Object.assign(draft, desc);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg.id }],
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
