const initialState = {
  products: [],
  categories: [],
  pagination: {
    pageNumber: 0,
    pageSize: 12,
    totalElements: 0,
    totalPages: 0,
    lastPage: false,
  },
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        pagination: {
          pageNumber: action.pageNumber ?? state.pagination.pageNumber,
          pageSize: action.pageSize ?? state.pagination.pageSize,
          totalElements: action.totalElements ?? state.pagination.totalElements,
          totalPages: action.totalPages ?? state.pagination.totalPages,
          lastPage: action.lastPage ?? state.pagination.lastPage,
        },
      };
    case "FETCH_CATEGORIES":
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};
