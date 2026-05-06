import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import deliveryAxios from "../../services/deliveryApi";

const DeliveryPartnerVerification = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        phone: "",
        vehicleType: "",
        vehicleNumber: "",
        licenseNumber: "",
        aadhaarNumber: "",
        profileImage: "",
        documentImage: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            const payload = {
                phone: formData.phone,
                vehicleType: formData.vehicleType,
                vehicleNumber: formData.vehicleNumber,
                licenseNumber: formData.licenseNumber,
                aadhaarNumber: formData.aadhaarNumber,
                profileImage: "",
                documentImage: ""
            };

            await deliveryAxios.put(
                "/delivery/profile/update",
                payload
            );

            setSuccessMessage(
                "Verification submitted successfully! Await admin approval."
            );

        } catch (error) {

            console.error(
                "Verification failed",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response
            );

            console.log(
                "ERROR DATA:",
                error.response?.data
            );

            alert("Verification failed");

        } finally {

            setLoading(false);
        }
    };

    const handleImageUpload = (e, field) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {

            setFormData((prev) => ({
                ...prev,
                [field]: reader.result
            }));
        };

        reader.readAsDataURL(file);
    };

    return (
        <div
            className="min-h-screen overflow-x-hidden text-[#1a1c1c]"
            style={{
                background:
                    "linear-gradient(135deg, #f8f4ee 0%, #f7e8ea 50%, #fdf2f4 100%)",
            }}
        >

            {/* BLOBS */}
            <div className="absolute w-[400px] h-[400px] bg-[#fdf2f4] top-[-100px] left-[-100px] blur-[80px] rounded-full opacity-60 -z-10"></div>

            <div className="absolute w-[300px] h-[300px] bg-[#f8f4ee] bottom-[-50px] right-[-50px] blur-[80px] rounded-full opacity-60 -z-10"></div>

            {/* HEADER */}
            <header
                className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-[#dac0c950]"
                style={{
                    background: "rgba(255,255,255,0.4)",
                    backdropFilter: "blur(40px)",
                    WebkitBackdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 10px 30px rgba(164,48,115,0.05)",
                }}
            >

                <div className="flex items-center gap-3">

                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-[#f3f3f4] transition-colors">
                        <span className="material-symbols-outlined text-[#a43073]">
                            arrow_back
                        </span>
                    </button>

                    <div className="flex items-center gap-2">

                        <div className="size-8 text-[#a43073]">
                            <svg
                                fill="none"
                                viewBox="0 0 48 48"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        <h2 className="text-xl font-bold tracking-tight text-[#a43073]">
                            ShopLite
                        </h2>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    <span className="bg-[#ffdcc5] text-[#693300] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Verification Pending
                    </span>

                    <div className="size-10 rounded-full overflow-hidden border-2 border-[#a4307330]">
                        <img
                            alt="User Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBujk6tFT0HQGBcn0aP5LojyKxMueQwdl3WZhMLlML1jkM-jzk7W2xpz8wUNprzjNqT66o5tg8b03l3cvNxOTHQbz-lOtTa3qHzYn-Hiq9ZSmL_I4m6rpyFuVRNU7_VFy0iYEmpAc2d1JU2zEJ9cilFRF55pmTkZtf8cNT4qOlJUmmEyZK5sO7y3E3PdrBRSFKE5W2zKXRs4PYi8qEt0JaOEmPoHDugp1ageQlgv2ZxawPF3mjQuZXRw32ivtkew09NBTu_HpPMWrU"
                        />
                    </div>

                </div>

            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-12">

                {/* TITLE */}
                <div className="text-center mb-12">

                    <h1 className="text-5xl font-extrabold mb-4">
                        Become a Delivery Partner
                    </h1>

                    <p className="text-[#544249] max-w-2xl mx-auto">
                        Submit your verification details to join the premium
                        ShopLite delivery network and start earning today.
                    </p>

                </div>

                {/* CARD */}
                <div
                    className="rounded-[32px] overflow-hidden grid lg:grid-cols-2 shadow-2xl"
                    style={{
                        background: "rgba(255,255,255,0.4)",
                        backdropFilter: "blur(40px)",
                        WebkitBackdropFilter: "blur(40px)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 10px 30px rgba(164,48,115,0.05)",
                    }}
                >

                    {/* LEFT */}
                    <div className="relative bg-gradient-to-br from-[#a4307310] to-[#fd933d10] p-12 flex flex-col items-center justify-center min-h-[400px]">

                        <div
                            className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage:
                                    "radial-gradient(#a43073 1px, transparent 1px)",
                                backgroundSize: "24px 24px",
                            }}
                        ></div>

                        <div
                            className="w-full aspect-square max-w-md bg-center bg-no-repeat bg-contain"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkIc-Ry3kIcXFYHAHgy8HnL__kTw7HP_HLCc0Hnaj9fwQAqVvbc3_WbjQoR33J8aTNFa35IUWb_GmGPRyDFPK8ZjXbZI9ouwktsNwaQ4ctkZt9QEhWAGcykvOyx6R4J4tWMpK34kz7Px_v6YL0SfKZivyxtbJ8Yzg7wGsKi4VPpOyKkC6Dmp5au9p4N5dmPreAOzW90O9oV5-kUT-GH8V1XUUiy_IpLHSKGBVZlhyRrkVN_FKAJPIYtHyKZQSajVwaSSKGprb4GqU')",
                            }}
                        ></div>

                        <div className="mt-8 text-center space-y-4">

                            <div className="flex items-center gap-3 justify-center text-[#a43073] font-semibold">
                                <span className="material-symbols-outlined">
                                    shield
                                </span>
                                <span>Tier-1 Document Verification</span>
                            </div>

                            <div className="p-6 rounded-xl bg-white/40 border border-white/60 backdrop-blur-sm">
                                <p className="text-sm italic text-[#544249]">
                                    "Join a community of 5000+ elite partners
                                    delivering excellence every day."
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="p-8 lg:p-12">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >

                            {/* PROFILE */}
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <div className="size-28 rounded-full border-2 border-dashed border-[#a4307340] flex flex-col items-center justify-center cursor-pointer hover:bg-[#a4307305] transition-all relative group overflow-hidden">

                                    {formData.profileImage ? (

                                        <img
                                            src={formData.profileImage}
                                            alt="profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />

                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[#a43073] text-4xl group-hover:scale-110 transition-transform">
                                                add_a_photo
                                            </span>

                                            <span className="text-[10px] font-bold uppercase text-[#a4307390] mt-1">
                                                Photo
                                            </span>
                                        </>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageUpload(
                                                e,
                                                "profileImage"
                                            )
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />

                                </div>
                                <p className="text-xs text-[#544249] font-medium">
                                    Upload a clear professional headshot
                                </p>

                            </div>

                            {/* FORM GRID */}
                            <div className="grid md:grid-cols-2 gap-6">

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a43073] mb-2">
                                        Phone Number
                                    </label>

                                    <div className="flex gap-2">

                                        <select className="w-24 px-3 py-3 rounded-lg bg-white/60 backdrop-blur-md">
                                            <option>+91</option>
                                            <option>+1</option>
                                            <option>+44</option>
                                        </select>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="000 000 0000"
                                            className="flex-1 px-4 py-3 rounded-lg bg-white/60 backdrop-blur-md"
                                        />

                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a43073] mb-2">
                                        Vehicle Type
                                    </label>
                                    <select
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white/60 backdrop-blur-md"
                                    >
                                        <option>Select vehicle</option>
                                        <option>Electric Bike</option>
                                        <option>Scooter</option>
                                        <option>Car</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a43073] mb-2">
                                        Vehicle Number
                                    </label>

                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        placeholder="AB 00 CD 1234"
                                        className="w-full px-4 py-3 rounded-lg bg-white/60 backdrop-blur-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a43073] mb-2">
                                        License Number
                                    </label>

                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="DL-XXXXXXX"
                                        className="w-full px-4 py-3 rounded-lg bg-white/60 backdrop-blur-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a43073] mb-2">
                                        Aadhaar Number
                                    </label>

                                    <input
                                        type="text"
                                        name="aadhaarNumber"
                                        value={formData.aadhaarNumber}
                                        onChange={handleChange}
                                        placeholder="XXXX XXXX XXXX"
                                        className="w-full px-4 py-3 rounded-lg bg-white/60 backdrop-blur-md"
                                    />
                                </div>

                            </div>

                            {/* UPLOAD */}
                            <div className="space-y-2">

                                <label className="block text-xs font-bold uppercase tracking-widest text-[#a43073]">
                                    Vehicle Image
                                </label>

                                <div className="border-2 border-dashed border-[#a4307320] rounded-xl p-8 text-center bg-[#a4307305] hover:bg-[#a4307310] transition-colors cursor-pointer relative overflow-hidden">

                                    <span className="material-symbols-outlined text-[#a43073] text-4xl mb-3">
                                        cloud_upload
                                    </span>

                                    <p className="text-sm font-semibold mb-1">
                                        Drag and drop Aadhaar or License
                                    </p>

                                    <p className="text-xs text-[#544249]">
                                        Maximum file size: 5MB (JPG, PNG, PDF)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageUpload(
                                                e,
                                                "documentImage"
                                            )
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />

                                    {formData.documentImage && (

                                        <img
                                            src={formData.documentImage}
                                            alt="vehicle"
                                            className="w-full h-52 object-cover rounded-2xl mt-4"
                                        />

                                    )}
                                </div>

                            </div>

                            {/* TOGGLE */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f3f3f480] border border-[#dac0c950]">

                                <div>
                                    <p className="text-sm font-bold">
                                        Available for Delivery
                                    </p>

                                    <p className="text-xs text-[#544249]">
                                        Toggle your visibility on the network
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="sr-only peer"
                                    />

                                    <div className="w-11 h-6 bg-[#87717a] rounded-full peer peer-checked:bg-[#a43073] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>

                            </div>

                            {/* BANNER */}
                            <div className="flex gap-3 p-4 rounded-xl bg-[#ffdcc530] border border-[#fd933d20] text-[#693300]">

                                <span className="material-symbols-outlined">
                                    info
                                </span>

                                <p className="text-xs font-medium leading-relaxed">
                                    Your account will be activated after our
                                    admin team completes the manual verification
                                    process. Usually takes 24-48 hours.
                                </p>

                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col gap-4 pt-4">

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl text-white font-bold text-lg tracking-wide flex items-center justify-center gap-2"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #a43073 0%, #f472b6 100%)",
                                        boxShadow:
                                            "0 8px 20px rgba(164,48,115,0.3)",
                                    }}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Submit Verification"}

                                    <span className="material-symbols-outlined">
                                        verified
                                    </span>
                                </button>
                                {successMessage && (

                                    <div className="p-4 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-semibold">

                                        {successMessage}

                                    </div>

                                )}
                            </div>

                        </form>
                    </div>

                </div>

            </main>

        </div>
    );
};

export default DeliveryPartnerVerification;