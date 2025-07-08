import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      {/* Animated fruit SVGs */}
      <div>
              {/* Orange */}
              <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="#FFA500" />
                  <ellipse cx="20" cy="12" rx="6" ry="2" fill="#7ED957" />
                </svg>
            </div>
      <div>
              {/* Grape */}
              <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="8" fill="#8e44ad" />
                  <circle cx="24" cy="24" r="6" fill="#9b59b6" />
                  <circle cx="12" cy="24" r="6" fill="#6c3483" />
                </svg>
            </div>
      <div>
              <CardHeader>
                  <CardTitle>
                      <span role="img" aria-label="fruit">
                          
                        </span>
                      Processing Payment... Please wait!
                      <span role="img" aria-label="fruit">
                          
                        </span>
                    </CardTitle>
                </CardHeader>
              <div>
                  <div></div>
                </div>
            </div>
    </Card>
  );
}

export default PaypalReturnPage;
