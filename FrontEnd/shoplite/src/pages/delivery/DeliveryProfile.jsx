import React from "react";
import DeliveryLayout from "../../components/delivery/DeliveryLayout";

const DeliveryProfile = () => {
  return (
    <DeliveryLayout>

      <div className="flex justify-center py-12">

        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border rounded-3xl p-8 shadow">

          {/* AVATAR */}
          <div className="flex flex-col items-center">

            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzlDuSttFpGxFdGCaf_wDrPQa5Dsg91VDhuYUk832danZo-vHq4L3RQ-L61Cz7PyWPXa1IjrQtP3kafakxaheGprdC54J3M2ZLiysH9NohtUlpdoFDHwkh1VRcZVl8qLzY1htTtZWXjoIr7Wid5C1-GAcRCEG3cMaG87eUlYK3fyTT43AiJkjzuDDqOwcQSEnTeraMbN6jv9REUn7dGjevs-RcDRp6sd-6OGlyoo69WcXKhqfaY9CgICjhXn0iIAHK62pwR1OjOUc"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-bold mt-4">Alex Rivera</h2>

            <span className="mt-2 px-4 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full">
              DELIVERY PARTNER
            </span>

          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400">Email</p>
              <p className="font-semibold">alex.rivera@shoplite.com</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400">Phone</p>
              <p className="font-semibold">+1 555 234 8901</p>
            </div>

          </div>

          {/* METRICS */}
          <div className="grid grid-cols-2 gap-6 mt-8">

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-2xl font-bold">1284</p>
              <p className="text-xs text-gray-400">Deliveries</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-2xl font-bold">4.9/5</p>
              <p className="text-xs text-gray-400">Rating</p>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">

            <button className="flex-1 bg-cyan-600 text-white py-3 rounded-xl">
              Edit Profile
            </button>

            <button className="flex-1 border py-3 rounded-xl text-red-500">
              Logout
            </button>

          </div>

        </div>

      </div>

    </DeliveryLayout>
  );
};

export default DeliveryProfile;