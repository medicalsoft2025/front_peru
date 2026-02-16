import React from 'react';
import { PersistentQueryProvider } from '../../wrappers/PersistentQueryProvider';
import { LocalStorageProvider } from '../providers/LocalStorageProvider';
import { PlanEstudio } from '../components/PlanEstudio';
import { PlanEstudioFormData } from '../interfaces/types';

export const PlanEstudioWrapper = () => {
    return (<>
        <PersistentQueryProvider>
            <LocalStorageProvider<PlanEstudioFormData> localStorageKey="planesEstudio">
                <PlanEstudio />
            </LocalStorageProvider>
        </PersistentQueryProvider>
    </>);
}