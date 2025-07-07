/** @format */

"use client";
import React, { useEffect, useState } from "react";
import { useNewMarketplace } from "@/context/new-marketplace-context";
import JointVentureSearch from "../search/JointVentureSearch";
import JVPropertyGrid from "../JVPropertyGrid";
import LOIUploadModal from "../modals/LOIUploadModal";

const JointVentureTab = () => {
  const {
    jvTab,
    fetchTabData,
    activeTab,
    isSelectedForInspection,
    toggleInspectionSelection,
    addLOIDocument,
    removeLOIDocument,
    getLOIDocument,
    setIsAddForInspectionOpen,
  } = useNewMarketplace();

  // Modal states
  const [loiUploadModal, setLoiUploadModal] = useState<{
    isOpen: boolean;
    property: any;
  }>({
    isOpen: false,
    property: null,
  });

  // Fetch initial data when tab becomes active
  useEffect(() => {
    if (activeTab === "jv" && jvTab.formikStatus === "idle") {
      fetchTabData("jv");
    }
  }, [activeTab, jvTab.formikStatus, fetchTabData]);

  const handlePropertyClick = (property: any) => {
    // Navigate to property details page
    const propertyId = property._id;
    window.open(`/property/jv/${propertyId}`, "_blank");
  };

  const handleInspectionToggle = (property: any) => {
    toggleInspectionSelection("jv", property);
  };

  const handleLOIUpload = (property: any) => {
    setLoiUploadModal({
      isOpen: true,
      property,
    });
  };

  const handleLOISubmit = (property: any, document: File) => {
    addLOIDocument(property._id, document);

    // Automatically select for inspection
    if (!isSelectedForInspection("jv", property._id)) {
      toggleInspectionSelection("jv", property);
    }

    setLoiUploadModal({ isOpen: false, property: null });
  };

  const handleRemoveLOI = (propertyId: string) => {
    removeLOIDocument(propertyId);
  };

  const openAddForInspection = () => {
    setIsAddForInspectionOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <JointVentureSearch />

      {/* Properties Grid */}
      <JVPropertyGrid
        tab="jv"
        properties={jvTab.properties}
        loading={jvTab.formikStatus === "pending"}
        error={jvTab.errMessage}
        searchStatus={jvTab.searchStatus}
        currentPage={jvTab.currentPage}
        totalPages={jvTab.totalPages}
        totalItems={jvTab.totalItems}
        onPropertyClick={handlePropertyClick}
        onInspectionToggle={handleInspectionToggle}
        onLOIUpload={handleLOIUpload}
        onRemoveLOI={handleRemoveLOI}
        selectedForInspection={jvTab.selectedForInspection}
        loiDocuments={jvTab.loiDocuments}
        onOpenAddForInspection={openAddForInspection}
      />

      {/* LOI Upload Modal */}
      {loiUploadModal.isOpen && (
        <LOIUploadModal
          isOpen={loiUploadModal.isOpen}
          property={loiUploadModal.property}
          onClose={() => setLoiUploadModal({ isOpen: false, property: null })}
          onSubmit={handleLOISubmit}
          existingDocument={getLOIDocument(loiUploadModal.property?._id)}
        />
      )}
    </div>
  );
};

export default JointVentureTab;
