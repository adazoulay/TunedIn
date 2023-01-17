import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useSearchUserQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(selectUsersResult, (usersResult) => usersResult.data);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
