"use client";

import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import cities from "@/public/cities.json";

import Button from "@/components/ui/Button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { RazorpayOptions, RazorpayResponse } from "@/lib/razorpay"; // Ensure the correct import path



const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [age, setAge] = useState<number>(0);
    const [location, setLocation] = useState("");

    const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);

    const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAddress = e.target.value;
        setAddress(newAddress);
        const foundCity = cities.find((city) =>
            newAddress.toLowerCase().includes(city.toLowerCase())
        );
        if (foundCity) {
            setCity(foundCity);
            setLocation(foundCity);
        } else {
            setCity("");
            setLocation("");
        }
    };

    const onCheckout = useCallback(async () => {
        if (!name || !email || !phone || !address || !age || !location) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (age < 0 || age > 150) {
            toast.error("Please enter a valid age.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
                {
                    productIds: items.map((item) => item.id),
                    name,
                    email,
                    phone,
                    address,
                    age,
                    location,
                }
            );

            const options: RazorpayOptions = {
                key: response.data.key,
                amount: response.data.amount,
                currency: response.data.currency,
                name: "Store",
                description: "Store",
                order_id: response.data.orderId,
                handler: (response: RazorpayResponse) => {
                    if (response.razorpay_payment_id) {
                        window.location.href = `/cart?success=1&orderId=${response.razorpay_order_id}`;
                    }
                },
                prefill: { name, email, contact: phone },
                notes: { address },
                theme: { color: "#000000" },
            };

            if (!window.Razorpay) {
                toast.error("Razorpay SDK not loaded.");
                return;
            }

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Checkout failed. Please try again.");
            console.error("[CHECKOUT_ERROR]", error);
        }
    }, [items, name, email, phone, address, age, location]);

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Payment completed successfully");
            removeAll();
        }
        if (searchParams.get("canceled")) {
            toast.error("Payment was cancelled");
        }
    }, [searchParams, removeAll]);

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">Order Total</div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Enter your Name"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Enter your Email"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Enter your age"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Enter your phone number"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    value={address}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Enter your address"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Enter your location"
                    disabled={city !== ""}
                />
            </div>
            <Button onClick={onCheckout} className="w-full mt-6" disabled={items.length === 0}>
                {items.length === 0 ? "No items in cart" : "Checkout"}
            </Button>
        </div>
    );
};

export default Summary;
