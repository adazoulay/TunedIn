import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const tagsAdapter = createEntityAdapter({
  selectId: (tag) => tag._id, // Extract the _id field as the unique identifier
});

const initialState = tagsAdapter.getInitialState();

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //! GET TAGS
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
    getTag: builder.query({
      query: (id) => `/tags/find/${id}`,
      transformResponse: (responseData) => {
        return tagsAdapter.addOne(initialState, responseData);
      },
      providesTags: (result, error, id) => [{ type: "Tag", id }],
    }),
    getTagsByPostId: builder.query({
      query: (id) => ({
        url: `/tags/post/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return tagsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [...result.ids.map((id) => ({ type: "Tag", id }))],
    }),
    getTagsByUserId: builder.query({
      query: (id) => ({
        url: `/tags/user/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        const loadedTags = responseData.map((tag) => {
          return tag;
        });
        return tagsAdapter.setAll(initialState, loadedTags);
      },
      providesTags: (result, error, arg) => [...result.ids.map((id) => ({ type: "Tag", id }))],
    }),
    searchTag: builder.query({
      query: (str) => `/tags/search?q=${str}`,
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        if (!responseData) {
          return;
        }
        const loadedTags = responseData.map((tag) => {
          return tag;
        });
        return tagsAdapter.setAll(initialState, loadedTags);
      },
      providesTags: (result, error, arg) => [...result.ids.map((id) => ({ type: "Tag", id }))],
    }),
    getTagAndRelatedTags: builder.query({
      query: (id) => ({
        url: `/tags/realted/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        const { tag, parents, children } = responseData;

        return {
          tag: tagsAdapter.addOne(initialState, tag),
          parents: tagsAdapter.addMany(initialState, parents),
          children: tagsAdapter.addMany(initialState, children),
        };
      },
      providesTags: (result, error, arg) => [
        ...result.tag.ids,
        ...result.parents.ids,
        ...result.children.ids.map((id) => ({ type: "Tag", id })),
      ],
    }),
    getTrendingTags: builder.query({
      query: (id) => ({
        url: `/tags/trending`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        const loadedTags = responseData.map((tag) => {
          return tag;
        });
        return tagsAdapter.setAll(initialState, loadedTags);
      },
      providesTags: (result, error, arg) => [...result.ids.map((id) => ({ type: "Tag", id }))],
    }),
    //! MUTATE TAG
    addNewTag: builder.mutation({
      query: (tag) => ({
        url: "/tags",
        method: "POST",
        body: {
          ...tag,
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
  useGetTagQuery,
  useGetTagAndRelatedTagsQuery,
  useGetTagsByPostIdQuery,
  useGetTagsByUserIdQuery,
  useSearchTagQuery,
  useGetTrendingTagsQuery,
  useAddNewTagMutation,
  useDeleteTagMutation,
} = tagsApiSlice;

export const selectTagsResult = tagsApiSlice.endpoints.getTags.select();

const selectTagsData = createSelector(selectTagsResult, (tagsResult) => tagsResult.data);

export const {
  selectAll: selectAllTags,
  selectById: selectTagById,
  selectIds: selectTagIds,
} = tagsAdapter.getSelectors((state) => selectTagsData(state) ?? initialState);
