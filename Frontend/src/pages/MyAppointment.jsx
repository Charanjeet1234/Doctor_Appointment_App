import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
const MyAppointment = () => {
  // const { doctors } = useContext(AppContext)
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
const navigate = useNavigate()
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId);
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //    const options = {
  //     key:import.meta.env.VITE_STRIPE_KEY_ID,
  //     amount: order.amount,
  //     currency:order.currency,
  //     name:"Appointment Payment",
  //     description:"Appointment Payment",
  //     order_id:order.id,
  //     receipt:order.receipt,
  //     handler:async (response) =>
  //     {
  //       console.log(response)
  //     }
  //    }
  //    const rzp = new window.Razorpay(options)
  //    rzp.open()
  // };

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);

  const initPay = async (order) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await axios.post(
        backendUrl + "/api/user/stripe-checkout",
        { order },
        { headers: { token } }
      );
      if(!OverconstrainedError.appointmentId)
      {
        console.error("❌ appointmentId is missing before sending to backend!");
      }
       console.log(order)
      if (response.data.success) {
        getUserAppointments()
        // Redirect user to Stripe Checkout
        console.log(response.data);
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (result.error) {
          console.error(result.error.message);
        }
      } else {
        console.error("Failed to create Stripe session.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

   // Fetch payment details after successful redirect from Stripe
  const fetchPaymentDetails = async (sessionId) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/verify-payment", { sessionId}, { headers: { token } });
      if(data.success)
      {
        setPaymentInfo(data)
        console.log("payment Status:", data);
      }
     else{
       toast.error("Failed to verify payment")
     }
      console.log(data);
    } catch (error) {
      console.log("Failed to fetch payment details.");
    } 
  };

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      fetchPaymentDetails(sessionId);
    }
  }, []);


  const appointmentStripePay = async (appointmentId) => {
    const { data } = await axios.post(
      backendUrl + "/api/user/payment-stripe",
      { appointmentId },
      { headers: { token } }
    );
    if (data.success) {
      console.log(data.order);
      initPay(data.order);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointment
      </p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600 ">
              <p className="text-neutral-700 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)}, | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && (
                <button
                  onClick={() => appointmentStripePay(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
