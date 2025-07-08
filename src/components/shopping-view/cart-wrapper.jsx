import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-card rounded-2xl shadow-2xl animate-fade-in-up transition-all duration-300">
      <SheetHeader>
        <SheetTitle className="text-2xl font-extrabold text-primary tracking-tight">Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              cartItem={item}
              key={item.productId + (item.size || "")}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>Your cart is empty.</p>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="mt-8 space-y-4">
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-xl text-primary">
              PKR {totalCartAmount.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full text-lg py-6 bg-primary text-primary-foreground transition-transform duration-200"
            disabled={!cartItems || cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;