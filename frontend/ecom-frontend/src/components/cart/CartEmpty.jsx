import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">

      <div className="flex flex-col items-center text-center bg-white shadow-md rounded-lg p-10">

        <MdShoppingCart size={70} className="text-gray-400 mb-4" />

        <h2 className="text-2xl font-semibold text-gray-800">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mt-2">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/products"
          className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <MdArrowBack />
          Start Shopping
        </Link>

      </div>

    </div>
  );
};

export default CartEmpty;