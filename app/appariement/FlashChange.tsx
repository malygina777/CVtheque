"use client";
import FlashChangeUI from "./FlashChangeUI";

export default function FlashChange() {
  return (
    <div>
      <FlashChangeUI
        domainsUrl="/api/general-domains"
        structureTypesUrl="/api/structure-types"
        linkSelectedDomain={(id) => {
          return `/api/general-domains/${id}/structure-types`;
        }}
        linkSave={(activeId) => {
          return `/api/general-domains/${activeId}/structure-types`;
        }}
      />
    </div>
  );
}
