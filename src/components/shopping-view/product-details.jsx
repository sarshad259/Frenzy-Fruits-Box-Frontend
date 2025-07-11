import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("medium");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  const sizeOptions = [
    { value: "small", label: "Small (8oz)" },
    { value: "medium", label: "Medium (12oz)" },
    { value: "large", label: "Large (16oz)" },
  ];

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // Helper to get price for selected size
  function getSizePrice() {
    if (
      productDetails?.category === "Milkshake" ||
      productDetails?.category === "Smoothie"
    ) {
      const sizeMap = {
        small: {
          price: productDetails?.smallPrice,
          salePrice: productDetails?.smallSalePrice,
          label: "Small (8oz)",
        },
        medium: {
          price: productDetails?.mediumPrice,
          salePrice: productDetails?.mediumSalePrice,
          label: "Medium (12oz)",
        },
        large: {
          price: productDetails?.largePrice,
          salePrice: productDetails?.largeSalePrice,
          label: "Large (16oz)",
        },
      };
      return sizeMap[selectedSize];
    }
    return {
      price: productDetails?.price,
      salePrice: productDetails?.salePrice,
      label: null,
    };
  }

  const sizePrice = getSizePrice();

  function handleAddToCart(productId, totalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const index = getCartItems.findIndex(item => item.productId === productId);
      if (index > -1 && getCartItems[index].quantity + 1 > totalStock) {
        toast({
          title: `Only ${getCartItems[index].quantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }
    // Pass size and price for milkshake/smoothie
    const cartPayload = {
      userId: user?.id,
      productId,
      quantity: 1,
    };
    if (productDetails?.category === "Milkshake" || productDetails?.category === "Smoothie") {
      cartPayload.size = selectedSize;
      cartPayload.price = sizePrice.price;
      cartPayload.salePrice = sizePrice.salePrice;
      cartPayload.sizeLabel = sizePrice.label;
    }
    dispatch(addCartItem(cartPayload)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
      else {
        toast({
          title: data.payload.message,
          variant: "destructive"
        })
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-2 sm:p-4 md:p-8 max-w-[98vw] md:max-w-[90vw] lg:max-w-[70vw] bg-card rounded-2xl shadow-2xl animate-fade-in-up transition-all duration-300">
        <div className="relative overflow-hidden rounded-xl group transition-transform duration-300 w-full max-w-[400px] mx-auto aspect-square flex items-center justify-center">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover transition-transform duration-300 rounded-xl"
            loading="lazy"
          />
        </div>
        {/* Make this column scrollable if content overflows */}
        <div className="flex flex-col justify-between w-full max-w-2xl mx-auto max-h-[80vh] overflow-auto pr-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 animate-fade-in">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-lg md:text-2xl mb-5 mt-4 animate-fade-in delay-100">
              {productDetails?.description}
            </p>
          </div>
          {/* Size selector for Milkshake/Smoothie */}
          {(productDetails?.category === "Milkshake" || productDetails?.category === "Smoothie") && (
            <div className="mb-1 text-base font-semibold text-primary animate-fade-in delay-150">
              {sizePrice?.label}
            </div>
          )}
          {/* Price display */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fade-in delay-200">
            <p
              className={`text-2xl md:text-3xl font-bold text-primary ${sizePrice?.salePrice > 0 ? "line-through" : ""}`}
            >
              PKR {sizePrice?.price}
            </p>
            {sizePrice?.salePrice > 0 ? (
              <p className="text-xl md:text-2xl font-bold text-primary/80">
                PKR {sizePrice?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2 animate-fade-in delay-300">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5 animate-fade-in delay-400">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full transition-transform duration-200"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator className="animate-fade-in delay-500" />
          {/* Only reviews list is scrollable now */}
          <div className="max-h-[300px] overflow-auto animate-fade-in delay-600 mt-4">
            <h2 className="text-lg md:text-xl font-bold mb-4">Reviews</h2>
            <div className="flex flex-col gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex flex-col sm:flex-row gap-4 bg-muted/60 rounded-xl p-3 shadow-sm transition-all duration-200">
                    <Avatar className="w-10 h-10 border bg-primary text-primary-foreground">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground break-words">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
          </div>
          {/* Review input and submit button always visible at the bottom */}
          <div className="mt-8 flex flex-col gap-2 animate-fade-in delay-700 w-full">
            <Label>Write a review</Label>
            <div className="flex gap-1 flex-wrap">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) => setReviewMsg(event.target.value)}
              placeholder="Write a review..."
              className="w-full"
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
              className="transition-transform duration-200 w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
