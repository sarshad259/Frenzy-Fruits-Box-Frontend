import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card>
      {/* Animated fruit background */}
      <div>
              <div>
                  <img src="/fruits/orange.svg" alt="Orange" loading="lazy" />
                </div>
              <div>
                  <img src="/fruits/banana.svg" alt="Banana" loading="lazy" />
                </div>
              <div>
                  <img src="/fruits/strawberry.svg" alt="Strawberry" loading="lazy" />
                </div>
            </div>
      <CardHeader>
              <CardTitle>
                  Payment is successful!
                </CardTitle>
            </CardHeader>
      <Button
       
        onClick={() => navigate("/shop/account")}
      >
              <span>
                  <svg width="24" height="24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#ffb703" />
                      <path d="M8 12l2 2 4-4" stroke="#232946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  View Orders
                </span>
            </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
