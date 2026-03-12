import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {

  const { cart } = useSelector((state) => state.carts);

  // Calculate total price
  const totalPrice = cart?.reduce(
    (acc, item) => acc + item.specialPrice * item.quantity,
    0
  );

  if (!cart || cart.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <MdShoppingCart size={32} />
          Your Cart
        </h1>
        <p className="text-gray-500 mt-1">All your selected items</p>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 font-semibold text-gray-700 pb-3 border-b">
        <div className="col-span-2">Product</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
      </div>

      {/* CART ITEMS */}
      <div>
        {cart.map((item) => (
          <ItemContent key={item.productId} {...item} />
        ))}
      </div>

      {/* SUMMARY */}
      <div className="border-t mt-6 pt-6 flex flex-col items-end gap-3">

        <div className="flex justify-between w-[300px] font-semibold text-lg">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <p className="text-gray-500 text-sm">
          Taxes and shipping calculated at checkout
        </p>

        {/* CHECKOUT BUTTON */}
        <Link to="/checkout">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            <MdShoppingCart size={20} />
            Checkout
          </button>
        </Link>

        {/* CONTINUE SHOPPING */}
        <Link
          to="/products"
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <MdArrowBack />
          Continue Shopping
        </Link>

      </div>

    </div>
  );
};

export default Cart;