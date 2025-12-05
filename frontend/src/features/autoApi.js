// autoApi.js
import { apiRequest } from "../utils/helperFunction";
import api from "./baseApi";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const autoApi = (name, tagName) => {
  const resourceName = capitalize(name);
  const singularName = capitalize(name.slice(0, -1));

  return api.injectEndpoints({
    endpoints: (builder) => ({
      // ---------------- GET ALL ----------------
      [`get${resourceName}`]: builder.query({
        query: () => apiRequest(`/${name}`),
        providesTags: (result) =>
          result && Array.isArray(result)
            ? [
                ...result.map(({ id }) => ({ type: tagName, id })),
                { type: tagName, id: "LIST" },
              ]
            : [{ type: tagName, id: "LIST" }],
      }),

      // ---------------- GET BY ID ----------------
      [`get${singularName}ById`]: builder.query({
        query: (id) => apiRequest(`/${name}/${id}`),
        providesTags: (_, __, id) => [{ type: tagName, id }],
      }),

      // ---------------- CREATE ----------------
      [`add${singularName}`]: builder.mutation({
        query: (newItem) => apiRequest(`/${name}`, "POST", newItem),
        invalidatesTags: [{ type: tagName, id: "LIST" }],
      }),

      // ---------------- UPDATE ----------------
      [`update${singularName}`]: builder.mutation({
        query: ({ id, ...patch }) => apiRequest(`/${name}/${id}`, "PUT", patch),
        invalidatesTags: (_, __, { id }) => [{ type: tagName, id }],
        async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            api.util.updateQueryData(
              `get${resourceName}`,
              undefined,
              (draft) => {
                const item = draft.find((i) => i.id === id);
                if (item) Object.assign(item, patch);
              }
            )
          );
          queryFulfilled.catch(() => patchResult.undo());
        },
      }),

      // ---------------- DELETE ----------------
      [`delete${singularName}`]: builder.mutation({
        query: (id) => apiRequest(`/${name}/${id}`, "DELETE"),
        invalidatesTags: (_, __, id) => [{ type: tagName, id }],
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            api.util.updateQueryData(`get${resourceName}`, undefined, (draft) =>
              draft.filter((i) => i.id !== id)
            )
          );
          queryFulfilled.catch(() => patchResult.undo());
        },
      }),
    }),
  });
};

export default autoApi;
