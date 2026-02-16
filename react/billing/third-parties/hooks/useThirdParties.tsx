import { useEffect } from "react";
import { ThirdPartyService } from "../../../../services/api/classes/thirdPartyService";
import { useState } from "react";

export const useThirdParties = () => {
  const [thirdParties, setThirdParties] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchThirdParties(filters: any = null) {
    setLoading(true);
    try {
      if (filters?.invoice_type) {
        const thirdPartyService = new ThirdPartyService();
        const thirdParties = await thirdPartyService.getAll();

        let dataFiltered = null;
        if (filters?.invoice_type === "tax_invoice") {
          dataFiltered = thirdParties.data.filter(
            (thirdParty: any) => thirdParty.document_type === "6",
          );
        } else {
          dataFiltered = thirdParties.data.filter(
            (thirdParty: any) => thirdParty.document_type !== "6",
          );
        }

        setThirdParties(dataFiltered);
        return;
      }
      const thirdPartyService = new ThirdPartyService();
      const thirdParties = await thirdPartyService.getAll();
      setThirdParties(thirdParties.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchThirdParties();
  }, []);

  return {
    thirdParties,
    fetchThirdParties,
    loading,
  };
};
