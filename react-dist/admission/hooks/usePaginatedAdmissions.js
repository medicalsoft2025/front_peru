import { useMemo } from "react";
import { admissionService } from "../../../services/api/index.js";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery.js";
import { cleanJsonObject, formatDate } from "../../../services/utilidades.js";
export const usePaginatedAdmissions = props => {
  const {
    filters
  } = props;
  const normalizedFilters = useMemo(() => filters, [filters]);
  const mapAdmissionToTableItem = item => {
    return {
      id: item.id,
      createdAt: formatDate(item.created_at),
      admittedBy: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
      patientName: `${item.patient.first_name || ""} ${item.patient.middle_name || ""} ${item.patient.last_name || ""} ${item.patient.second_last_name || ""}`,
      entityName: item.entity?.name || "--",
      koneksiClaimId: item.koneksi_claim_id,
      patientDNI: item.patient.document_number || "--",
      authorizationNumber: item.authorization_number || "--",
      authorizedAmount: item.entity_authorized_amount || "0.00",
      originalItem: item,
      status: item.status,
      invoiceCode: item?.invoice?.invoice_code || "",
      invoiceId: item?.invoice?.id || "",
      products: item?.invoice?.details?.map(detail => detail.product.name).join(", ") || "",
      companyName: item?.company?.legal_name || "--"
    };
  };
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    handlePageChange,
    handleSearchChange,
    first,
    perPage
  } = usePaginatedQuery({
    queryKey: ["admissions", normalizedFilters],
    queryFn: async paginationParams => {
      try {
        const data = await admissionService.filterAdmissions(cleanJsonObject(filters));
        const mappedAdmissions = data.data.data.map(mapAdmissionToTableItem);
        return {
          mappedAdmissions,
          total: data.data.total
        };
      } catch (error) {
        console.error(error);
        return {
          mappedAdmissions: [],
          total: 0
        };
      }
    }
  });
  return {
    data: data?.mappedAdmissions || [],
    loading: isLoading || isFetching,
    isFetching,
    error,
    refresh: refetch,
    handlePageChange,
    handleSearchChange,
    totalRecords: data?.total || 0,
    first,
    perPage
  };
};