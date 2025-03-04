import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "@chakra-ui/react";
import { backendBaseUrl } from "../../../../config/utils/urls";
import stores from "../../../../store/stores";

// Define TypeScript interfaces for the payment options and user info
interface UserInfo {
  name: string;
  email: string;
  contact: string;
  refrenceOrderId:string
}

const useRazorpay = () => {
  const {
    auth: { openNotification },
  } = stores;
  const theme = useTheme();
  const tealColor = theme.colors.teal[500]; // This will give you the teal color code
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Razorpay SDK URL
    script.onload = () => setIsScriptLoaded(true);
    // script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  const createOrderPayment = async (datas: any): Promise<any> => {
    try {
      const { data } = await axios.post(
        `${backendBaseUrl}/order/create/payment`,
        { ...datas },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem(process.env.REACT_APP_AUTHORIZATION_TOKEN as string)
            }`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      // console.error("Error creating order:", error);
      throw new Error(error?.message);
    }
  };

  const handlePayment = async (
    amount: number,
    userInfo: UserInfo
  ): Promise<void> => {
    if (!isScriptLoaded) {
      alert("Razorpay SDK is not loaded yet");
      return;
    }

    try {
      const order : any = await createOrderPayment({amount : amount, refrenceOrderId : userInfo.refrenceOrderId})
      const options: any  = {
        key: "rzp_test_0XDl7Od4MRUktB",
        amount: order.amount,
        currency: order.currency,
        name: userInfo.name,
        image: process.env.WEB_LOGO!,
        description: "Test Transaction",
        order_id: order?.data?.id,
        handler: async (response : any) => {
          try {
            const { data } = await axios.post(
              `${backendBaseUrl}/order/verify/payment`,
              { ...response },
              {
                headers: {
                  Authorization: `Bearer ${
                    localStorage.getItem(process.env.REACT_APP_AUTHORIZATION_TOKEN as string)
                  }`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (data.status === "success") {
              openNotification({
                title: "Payment Success",
                message: data?.message,
                type: "success",
              });
            } else {
              openNotification({
                title: "Payment Failed",
                message: data?.message,
                type: "success",
              });
            }
          } catch (error) {
            throw new Error(error?.message);
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.contact,
        },
        theme: {
          color: tealColor,
        },
        method: {
          netbanking: true,
          upi: true,
          card: true,
          wallet: true,
          emi: true,
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert(error?.message);
    }
  };

  return { handlePayment };
};

export default useRazorpay;