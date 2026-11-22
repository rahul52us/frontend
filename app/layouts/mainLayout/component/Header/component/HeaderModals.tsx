"use client";

import React from "react";
import dynamic from "next/dynamic";
import stores from "../../../../../store/stores";

const LocationSelectModal = dynamic<any>(
  () => import("../../../../../component/common/LocationModal/LocationSelectModal"),
  { ssr: false }
);

const AddressModal = dynamic<any>(
  () => import("../../../../../(main)/account/component/AddressSection/AddressModal/AddressModal"),
  { ssr: false }
);

interface HeaderModalsProps {
  isLocationModalOpen: boolean;
  onLocationModalClose: () => void;
  isAddAddressOpen: boolean;
  onAddAddressOpen: () => void;
  onAddAddressClose: () => void;
}

export const HeaderModals: React.FC<HeaderModalsProps> = ({
  isLocationModalOpen,
  onLocationModalClose,
  isAddAddressOpen,
  onAddAddressOpen,
  onAddAddressClose,
}) => {
  return (
    <>
      {/* Location Select Modal */}
      {isLocationModalOpen && (
        <LocationSelectModal
          isOpen={isLocationModalOpen}
          onClose={onLocationModalClose}
          onOpenAddNewAddress={onAddAddressOpen}
        />
      )}

      {/* Quick Add Address Modal */}
      {isAddAddressOpen && (
        <AddressModal
          isOpen={isAddAddressOpen}
          onClose={onAddAddressClose}
          handleSubmit={async (e: any) => {
            e.preventDefault();
            const form = e.target;
            const payload = {
              name: form.name.value,
              phone: form.phone.value,
              line1: form.line1.value,
              line2: form.line2?.value || "",
              city: form.city.value,
              state: form.state.value,
              postalCode: form.postalCode.value,
              country: form.country?.value || "India",
              isDefault: Boolean(form.isDefault?.checked),
            };
            try {
              await stores.auth.addAddress(payload);
              onAddAddressClose();
            } catch (err: any) {
              console.error("Failed to add address:", err);
            }
          }}
        />
      )}
    </>
  );
};

export default React.memo(HeaderModals);
