"use client";
import FlashChangeUI from "./FlashChangeUI";

export default function FlashChangeCardActivity() {
  return (
    <div>
      <FlashChangeUI
        domainsUrl="/api/general-domains-structure"
        structureTypesUrl="/api/nature-activity"
        linkSelectedDomain={(id) => {
          return `/api/general-domains-activity/${id}`;
        }}
        linkSave={(activeId) => {
          return `/api/general-domains-activity/${activeId}`;
        }}
      />
    </div>
  );
}
