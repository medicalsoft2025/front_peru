import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';
import { useClinicalRecordSectionsByType } from "./useClinicalRecordSectionsByType";
import { useClinicalRecordSectionCreate } from "./useClinicalRecordSectionCreate";
import { useClinicalRecordSectionUpdate } from "./useClinicalRecordSectionUpdate";
import { useClinicalRecordSectionDelete } from "./useClinicalRecordSectionDelete";
import { useClinicalRecordSectionReorder } from "./useClinicalRecordSectionReorder";
import { ClinicalRecordSectionFormInputs } from "../interfaces/models";

export const useClinicalRecordSections = (clinicalRecordTypeId: string) => {
    const {
        sections,
        isFetching: isFetchingSections,
        refetch: refetchSections
    } = useClinicalRecordSectionsByType(clinicalRecordTypeId);

    const {
        createSection,
        loading: isCreating,
        toast: toastCreate
    } = useClinicalRecordSectionCreate();

    const {
        updateSection,
        loading: isUpdating,
        toast: toastUpdate
    } = useClinicalRecordSectionUpdate();

    const {
        deleteClinicalRecordSection,
        loading: isDeleting,
        toast: toastDelete
    } = useClinicalRecordSectionDelete();

    const {
        reorderSections: reorderService,
        loading: isReordering,
        toast: toastReorder
    } = useClinicalRecordSectionReorder();

    // Centralized save method as requested by user
    const save = async (data: ClinicalRecordSectionFormInputs) => {
        let result;
        if (data.id) {
            result = await updateSection(data.id, data);
        } else {
            result = await createSection(data);
        }

        if (result) {
            refetchSections();
        }
        return result;
    };

    const remove = async (id: string) => {
        const result = await deleteClinicalRecordSection(id);
        if (result) {
            refetchSections();
        }
        return result;
    }

    const queryClient = useQueryClient();

    const reorderSections = async (items: any[]) => {
        // Prepare items with updated order index
        const orderedItems = items.map((item, index) => ({
            ...item,
            order: index
        }));

        // Payload for backend: only needs id and order
        const reorderPayload = orderedItems.map(item => ({
            id: item.id,
            order: item.order
        }));

        // Optimistic update
        const queryKey = ['clinical-record-sections', clinicalRecordTypeId.toString()];
        const previousSections = queryClient.getQueryData(queryKey);

        // Update cache immediately to reflect the drag and drop in the UI
        queryClient.setQueryData(queryKey, orderedItems);

        try {
            const result = await reorderService(reorderPayload);
            if (!result) {
                // Revert on failure (if result suggests failure, though usually throwing catches it)
                // Use invalidation to likely restore true state if we can't revert perfectly
                queryClient.invalidateQueries({ queryKey });
            }
            // If successful, we might not strictly need to refetch if we trust our optimistic update,
            // but refetching ensures consistency.
            // refetchSections(); 
        } catch (error) {
            console.error("Reorder failed, reverting:", error);
            // Revert to previous state
            queryClient.setQueryData(queryKey, previousSections);
            toastReorder?.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el orden.' });
        }
    }

    return {
        sections,
        isFetching: isFetchingSections,
        refetch: refetchSections,
        save,
        remove,
        reorderSections,
        isSaving: isCreating || isUpdating || isDeleting || isReordering,
        toastCreate,
        toastUpdate,
        toastDelete,
        toastReorder
    };
};
