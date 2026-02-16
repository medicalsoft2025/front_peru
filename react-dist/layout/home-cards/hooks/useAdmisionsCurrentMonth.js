import { admissionService } from "../../../../services/api/index.js";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { useQuery } from "@tanstack/react-query";
export const useAdmisionsCurrentMonth = () => {
  const {
    toast,
    showServerErrorsToast
  } = usePRToast();
  const {
    data
  } = useQuery({
    queryKey: ['admisions-current-month'],
    queryFn: () => fetchAdmisionCurrentMonth()
  });
  const fetchAdmisionCurrentMonth = async () => {
    try {
      const response = await admissionService.getAdmisionsCurrentMonth();
      return response.data;
    } catch (error) {
      showServerErrorsToast(error);
    }
  };
  return {
    admisionCount: data,
    fetchAdmisionCurrentMonth,
    toast
  };
};