import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const commentsAdapter = createEntityAdapter({
  selectId: (comment) => comment._id, // Extract the _id field as the unique identifier
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
        const loadedComments = responseData.map((post) => {
          return post;
        });
        return commentsAdapter.setAll(initialState, loadedComments);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "Comment", id })),
      ],
    }),
    addNewComment: builder.mutation({
      query: (initialComment) => ({
        url: "/comments",
        method: "POST",
        body: {
          ...initialComment,
          userId: Number(initialComment.userId),
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Comment", id: "LIST" }],
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
  (commentsResult) => commentsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllComments,
  selectById: selectCommentById,
  selectIds: selectCommentIds,
  // Pass in a selector that returns the comments slice of state
} = commentsAdapter.getSelectors((state) => selectCommentsData(state) ?? initialState);
