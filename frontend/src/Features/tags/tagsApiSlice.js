import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const tagsAdapter = createEntityAdapter({
  selectId: (tag) => tag._id, // Extract the _id field as the unique identifier
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = tagsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: () => "/tags",
      transformResponse: (responseData) => {
        const loadedTags = responseData.map((tag) => {
          return tag;
        });
        return tagsAdapter.setAll(initialState, loadedTags);
      },
      providesTags: (result, error, arg) => [
        { type: "Tag", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Tag", id })),
      ],
    }),
    getTagsByPostId: builder.query({
      query: (id) => ({
        url: `/tags/post/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        const loadedTags = responseData.map((post) => {
          return post;
        });
        return tagsAdapter.setAll(initialState, loadedTags);
      },
      providesTags: (result, error, arg) => [...result.ids.map((id) => ({ type: "Tag", id }))],
    }),
    addNewTag: builder.mutation({
      query: (initialTag) => ({
        url: "/tags",
        method: "POST",
        body: {
          ...initialTag,
          userId: Number(initialTag.userId),
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
    deleteTag: builder.mutation({
      query: ({ id }) => ({
        url: `/tag/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Tag", id: arg.id }],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagsByPostIdQuery,
  useAddNewTagMutation,
  useDeleteTagMutation,
} = extendedApiSlice;

export const selectTagsResult = extendedApiSlice.endpoints.getTags.select();

const selectTagsData = createSelector(
  selectTagsResult,
  (tagsResult) => tagsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllTags,
  selectById: selectTagById,
  selectIds: selectTagIds,
  // Pass in a selector that returns the tags slice of state
} = tagsAdapter.getSelectors((state) => selectTagsData(state) ?? initialState);
