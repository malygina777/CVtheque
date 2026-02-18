"use client";
import FlashChangeUI from "./FlashChangeUI";

export default function FlashChangeCardStructure() {
  return (
    <div >
      <FlashChangeUI
        domainsUrl="/api/general-domains-structure"
        structureTypesUrl="/api/structure-types"
        linkSelectedDomain={(id) => {
          return `/api/general-domains-structure/${id}/structure-types`;
        }}
        linkSave={(activeId) => {
          return `/api/general-domains-structure/${activeId}/structure-types`;
        }}
      />
    </div>
  );
}
