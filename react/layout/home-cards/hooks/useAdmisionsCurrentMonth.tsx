import React, { useEffect, useState } from "react"
import { admissionService } from "../../../../services/api";
import { usePRToast } from "../../../hooks/usePRToast";
import { useQuery } from "@tanstack/react-query";

interface AdmisionCountData {
    year: number;
    month: number;
    month_name: string;
    period: string;
    admissions_count: number;
    date_range: string;
}



export const useAdmisionsCurrentMonth = () => {
    const { toast, showServerErrorsToast } = usePRToast();

    const {
        data
    } = useQuery({
        queryKey: ['admisions-current-month'],
        queryFn: () => fetchAdmisionCurrentMonth()
    });

    const fetchAdmisionCurrentMonth = async () => {
        try {
            const response = await admissionService.getAdmisionsCurrentMonth();
            return response.data
        } catch (error) {
            showServerErrorsToast(error)
        }
    }

    return { admisionCount: data, fetchAdmisionCurrentMonth, toast }
}