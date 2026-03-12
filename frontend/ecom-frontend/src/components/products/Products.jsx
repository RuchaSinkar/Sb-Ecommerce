import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";
import Filter from "./Filter";
import { fetchCategories } from "../../store/actions";
import { FaExclamationTriangle } from "react-icons/fa";

const Products = () => {
  const dispatch = useDispatch();

  const { products, categories, pagination } = useSelector(
    (state) => state.products
  );

  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">

      {/* FILTER */}
      <Filter categories={categories || []} />

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="flex justify-center items-center py-20 text-red-600 gap-2">
          <FaExclamationTriangle />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PRODUCTS */}
      {!isLoading && !errorMessage && (
        <>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 pt-10">
            {products?.map((product) => (
              <ProductCard key={product.productId} {...product} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-10">
            <Paginations
              numberOfPage={pagination?.totalPages}
              totalProducts={pagination?.totalElements}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;