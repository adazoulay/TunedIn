import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { current } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  //! GET USER
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/users/find/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return usersAdapter.setOne(initialState, responseData);
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getUserByPostId: builder.query({
      query: (id) => ({
        url: `/users/post/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return usersAdapter.setOne(initialState, responseData);
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    searchUser: builder.query({
      query: (str) => `/users/search?q=${str}`,
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        if (!responseData) {
          return;
        }
        const loadedUsers = responseData.map((user) => {
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map((id) => ({ type: "User", id })),
      ],
    }),
    //! MUTATE USER
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/signup",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    //! Follow, like, save
    followUser: builder.mutation({
      query: ({ id, newFollowers }) => ({
        url: `/users/follow/${id}`,
        method: "put",
        body: { id },
      }),
      async onQueryStarted({ id, newFollowers }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUser", id, (draft) => {
            const user = draft.entities[id];
            if (user) user.followers = newFollowers;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    unFollowUser: builder.mutation({
      query: ({ id, newFollowers }) => ({
        url: `/users/unfollow/${id}`,
        method: "put",
        body: { id },
      }),
      async onQueryStarted({ id, newFollowers }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getUser", id, (draft) => {
            const user = draft.entities[id];
            if (user) user.followers = newFollowers;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    followTag: builder.mutation({
      query: ({ id, newFollowers }) => ({
        url: `/users/followTag/${id}`,
        method: "put",
        body: { id },
      }),
      async onQueryStarted({ id, newFollowers }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getTagAndRelatedTags", id, (draft) => {
            const tag = draft.tag.entities[draft.tag.ids[0]];
            if (tag) tag.followers = newFollowers;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    unFollowTag: builder.mutation({
      query: ({ id, newFollowers }) => ({
        url: `/users/unfollowTag/${id}`,
        method: "put",
        body: { id },
      }),
      async onQueryStarted({ id, newFollowers }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData("getTagAndRelatedTags", id, (draft) => {
            const tag = draft.tag.entities[draft.tag.ids[0]];
            if (tag) tag.followers = newFollowers;
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
  useGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetUserByPostIdQuery,
  useSearchUserQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFollowUserMutation,
  useUnFollowUserMutation,
  useFollowTagMutation,
  useUnFollowTagMutation,
} = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(selectUsersResult, (usersResult) => usersResult.data);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
