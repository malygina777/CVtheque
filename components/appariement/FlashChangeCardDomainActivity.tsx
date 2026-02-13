"use client";
import FlashChangeUI from "./FlashChangeUI";

export default function FlashChangeCardActivity() {
  return (
    <div>
      <FlashChangeUI
        domainsUrl="/api/general-domains"
        structureTypesUrl="/api/nature-activity"
        linkSelectedDomain={(id) => {
          return `/api/general-domains-activity/${id}/nature-activity`;
        }}
        linkSave={(activeId) => {
          return `/api/general-domains-activity/${activeId}/nature-activity`;
        }}
      />
    </div>
  );
}
