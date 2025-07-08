import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addCartItem, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Apple,
  Nut,
  Salad,
  Coffee,
  CupSoda,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import frenzyLogo from "@/assets/Frenzy-logo.png";

const categoriesWithIcon = [
  { id: "Fresh_fruits", label: "Fresh fruits", icon: Apple },
  { id: "Salad", label: "Salad", icon: Salad },
  { id: "Dry_fruits", label: "Dry fruits", icon: Nut },
  { id: "Milkshake", label: "Milkshake", icon: Coffee },
  { id: "Smoothie", label: "Smoothie", icon: CupSoda },
];

const brandsWithIcon = [
  { id: "Frenzy Fruits", label: "Frenzy Fruits", icon: frenzyLogo },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddToCart = (productId) => {
    dispatch(
      addCartItem({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart!" });
      }
    });
  };

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        featureImageList?.length
          ? (prev + 1) % featureImageList.length
          : 0
      );
    }, 10000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in">
      {/* Hero Slider */}
      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[600px] overflow-hidden">
        {featureImageList.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            loading="lazy"
          />
        ))}

        <Button
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) =>
                (prev - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/70 text-foreground"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/70 text-foreground"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Categories */}
      <section className="py-8 md:py-12 bg-secondary animate-fade-in-up">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categoriesWithIcon.map((category) => (
              <Card
                key={category.id}
                onClick={() =>
                  handleNavigateToListingPage(category, "category")
                }
                className="cursor-pointer transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div
                    className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 
                      ${category.id === "Fresh_fruits"
                        ? "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-500/50"
                        : category.id === "Salad"
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/50"
                        : category.id === "Dry_fruits"
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-yellow-500/50"
                        : category.id === "Milkshake"
                        ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-purple-500/50"
                        : category.id === "Smoothie"
                        ? "bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-pink-500/50"
                        : "bg-gray-400 text-white"
                      }`}
                  >
                    <category.icon className="w-8 h-8" />
                  </div>
                  <span className="font-semibold text-center">
                    {category.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-8 md:py-12 bg-background animate-fade-in-up">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {brandsWithIcon.map((brand) => (
              <Card
                key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                className="w-full max-w-[280px] sm:w-[280px] h-auto flex items-center justify-center cursor-pointer transition"
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <img
                    src={brand.icon}
                    alt={brand.label}
                    className="w-full h-auto max-h-[160px] object-contain mb-3"
                    loading="lazy"
                  />
                  <span className="text-lg font-medium">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Products */}
      <section className="py-8 md:py-12 bg-secondary animate-fade-in-up">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up">
            {productList.map((product) => (
              <ShoppingProductTile
                key={product.id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/* Footer */}
      <footer className="bg-background border-t shadow-sm mt-auto">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8 animate-fade-in-up">
            {/* Brand Info */}
            <div className="max-w-md">
              <h4 className="text-2xl font-semibold text-foreground mb-2">
                🥭 Frenzy Fruits
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pure & Natural, Straight to You. Experience the vibrant taste of our smoothies, fruits, and other offerings — no chemicals, no preservatives.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-8">
              <a
                href="https://wa.me/923308121736"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-green-500 transition-transform duration-300"
              >
                <FaWhatsapp className="w-10 h-10" />
              </a>
              <a
                href="https://www.instagram.com/frenzyfruitsbox/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-pink-500 transition-transform duration-300"
              >
                <FaInstagram className="w-10 h-10" />
              </a>
              <a
                href="http://facebook.com/share/19Cxoh5k98/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-blue-600 transition-transform duration-300"
              >
                <FaFacebook className="w-10 h-10" />
              </a>
            </div>
          </div>

          {/* Bottom note */}
          <div className="border-t mt-8 pt-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Frenzy Fruits. All rights reserved.
          </div>
        </div>
      </footer>


    </div>
  );
}

export default ShoppingHome;
