import ProductCard from "./shared/ProductCard";

const products = [
  {
    productName: "iPhone 13 Pro Max",
    description:
      "Powerful A15 Bionic chip, stunning display and advanced camera system.",
    image: "https://embarkx.com/sample/placeholder.png",
    price: 780,
    specialPrice: 720,
  },
  {
    productName: "Samsung Galaxy S21",
    description:
      "Premium AMOLED display, sleek design and high performance.",
    image: "https://embarkx.com/sample/placeholder.png",
    price: 799,
    specialPrice: 699,
  },
  {
    productName: "Google Pixel 6",
    description:
      "AI-powered smartphone with amazing camera and smooth performance.",
    image: "https://embarkx.com/sample/placeholder.png",
    price: 599,
    specialPrice: 400,
  },
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        About Us
      </h1>

      {/* About Section */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">

        <div className="lg:w-1/2">
          <p className="text-lg">
            Welcome to our e-commerce store! We aim to provide high quality
            products with a smooth and enjoyable shopping experience.
          </p>

          <p className="mt-4 text-lg">
            This project is built by <b>Rucha</b>, a Computer Engineering
            student who enjoys building modern web applications and
            exploring full-stack development.
          </p>
        </div>

        <div className="lg:w-1/2">
          <img
            src="https://embarkx.com/sample/placeholder.png"
            alt="About"
            className="rounded-lg shadow-lg hover:scale-105 transition"
          />
        </div>

      </div>

      {/* Products Section */}
      <h2 className="text-3xl font-bold text-center mb-8">
        Our Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.productName}
            {...product}
            about
          />
        ))}
      </div>

    </div>
  );
};

export default About;