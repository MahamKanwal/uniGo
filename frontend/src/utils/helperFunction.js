export const apiRequest = (url = "", method = "GET", body = undefined) => ({
  url,
  method,
  body,
});

// export const createTagOfData = (result, type) =>
//   result
//     ? [...result.map(({ id }) => ({ type, id })), { type, id: "LIST" }]
//     : [{ type, id: "LIST" }];