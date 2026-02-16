const getSponsorSlugByAppointment = appointment => {
  return appointment.patient.social_security.entity.koneksi_sponsor_slug;
};
const getConsultProductCodeBySponsorSlug = sponsorSlug => {
  switch (sponsorSlug) {
    case "UNIVERSAL":
      return "890202";
    case "SENASA":
      return "2467";
    case "PRIMERA":
      return "1086";
  }
};
const getPayloadInfoByAppointmentType = (appointment, products) => {
  const type = appointment.attention_type;
  switch (type) {
    case "OPTOMETRY":
    case "CONSULTATION":
      return {
        type: "CONSULTA_MEDICA",
        consultProductCode: getConsultProductCodeBySponsorSlug(getSponsorSlugByAppointment(appointment))
      };
    case "LABORATORY":
    case "PROCEDURE":
      return {
        type: "PROCEDIMIENTO_MEDICO",
        products: products.map(product => ({
          providerProductCode: product.barcode,
          productName: product.name,
          productTypeSlug: type === "LABORATORY" ? "laboratory" : "medical-procedure",
          quantity: product.quantity,
          cost: 0
        }))
      };
  }
};
export const appointmentToInitClaimProcessPayload = (appointment, products) => {
  const payloadInfo = getPayloadInfoByAppointmentType(appointment, products);
  let payload = {
    sponsorSlug: getSponsorSlugByAppointment(appointment),
    identificationType: "CEDULA",
    identificationNumber: appointment.patient.document_number,
    providerTransactionId: `${appointment.id}-${appointment.patient.id}-${appointment.user_availability.user.id}`,
    claimInfo: {
      type: payloadInfo.type,
      doctor: {
        fullName: appointment.user_availability.user.full_name,
        medicalLicenseNumber: appointment.user_availability.user.clinical_record,
        specialityName: appointment.user_availability.user.specialty.name
      },
      diagnoses: ["Z00.0"],
      medicalConsultationReason: appointment.consultation_purpose,
      consultProductCode: payloadInfo.consultProductCode,
      products: payloadInfo.products
    }
  };
  return payload;
};