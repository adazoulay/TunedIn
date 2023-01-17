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
    addNewComment: builder.mutation({
      query: ({ id, desc, userId, username }) => ({
        url: `/comments/${id}`,
        method: "POST",
        body: {
          userId,
          username,
          desc,
        },
      }),
      async onQueryStarted({ id, desc }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData("getCommentsByPostId", id, (draft) => {
            const post = draft.entities[id];
            console.log(current(draft));
            post.comments.push({ userId, username, desc });
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
