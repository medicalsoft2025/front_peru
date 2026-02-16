import { userService } from "../../../services/api/index.js";
import { getJWTPayload } from "../../../services/utilidades.js";
import { useQuery } from "@tanstack/react-query";
export const useLoggedUser = () => {
  const {
    data: loggedUser,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['logged-user'],
    queryFn: () => userService.getByExternalId(getJWTPayload().sub)
  });
  return {
    loggedUser,
    loading: isLoading || isFetching
  };
};