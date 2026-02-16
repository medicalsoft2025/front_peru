import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { EnvironmentalAreaList } from './EnvironmentalAreaList';
import { EnvironmentalCalendarLayout } from '../layouts/EnvironmentalCalendarLayout';
import { EnvironmentalCalendar } from './EnvironmentalCalendar';
import { EnvironmentalWasteCategoryList } from './EnvironmentalWasteCategoryList';
import { EnvironmentalAreaProtocolList } from './EnvironmentalAreaProtocolList';
import { EnvironmentalCalendarFilterFormValues, EnvironmentalCalendarFilterItemInterface, EnvironmentalCalendarFilterTreeItemInterface, EnvironmentalCalendarFilterType, StoreEnvironmentalAreaProtocolParams } from '../interfaces/types';
import { useEnvironmentalWasteCategories } from '../hooks/waste-categories/useEnvironmentalWasteCategories';
import { useEnvironmentalAreas } from '../hooks/areas/useEnvironmentalAreas';
import { EnvironmentalFilterFormDialog } from './EnvironmentalFilterFormDialog';
import { useEnvironmentalWasteCategoryCreate } from '../hooks/waste-categories/useEnvironmentalWasteCategoryCreate';
import { useEnvironmentalAreaCreate } from '../hooks/areas/useEnvironmentalAreaCreate';
import { useEnvironmentalAreaProtocolCreate } from '../hooks/area-protocols/useEnvironmentalAreaProtocolCreate';
import { Toast } from 'primereact/toast';

import { useEnvironmentalWasteCategoryUpdate } from '../hooks/waste-categories/useEnvironmentalWasteCategoryUpdate';
import { useEnvironmentalAreaUpdate } from '../hooks/areas/useEnvironmentalAreaUpdate';
import { useEnvironmentalAreaProtocolUpdate } from '../hooks/area-protocols/useEnvironmentalAreaProtocolUpdate';
import { EnvironmentalRecordFormDialog } from './EnvironmentalRecordFormDialog';
import { useEnvironmentalWasteCategoryDelete } from '../hooks/waste-categories/useEnvironmentalWasteCategoryDelete';
import { useEnvironmentalAreaDelete } from '../hooks/areas/useEnvironmentalAreaDelete';
import { useEnvironmentalAreaProtocolDelete } from '../hooks/area-protocols/useEnvironmentalAreaProtocolDelete';

export const EnvironmentalApp = () => {

    const [filterFormVisible, setFilterFormVisible] = useState(false);
    const [filterFormType, setFilterFormType] = useState<EnvironmentalCalendarFilterType>('waste-category');
    const [filterFormTitle, setFilterFormTitle] = useState<string>('Nuevo Registro');

    const [recordFormVisible, setRecordFormVisible] = useState(false);

    const [selectedWasteCategory, setSelectedWasteCategory] = useState<EnvironmentalCalendarFilterItemInterface | null>(null);
    const [selectedArea, setSelectedArea] = useState<EnvironmentalCalendarFilterItemInterface | null>(null);
    const [selectedProtocol, setSelectedProtocol] = useState<EnvironmentalCalendarFilterItemInterface | null>(null);
    const [editingItem, setEditingItem] = useState<EnvironmentalCalendarFilterItemInterface | null>(null);

    const { wasteCategories, refetch: refetchWasteCategories } = useEnvironmentalWasteCategories();
    const { areas, refetch: refetchAreas } = useEnvironmentalAreas();

    const { createEnvironmentalWasteCategory, loading: createEnvironmentalWasteCategoryLoading, toast: createEnvironmentalWasteCategoryToast } = useEnvironmentalWasteCategoryCreate();
    const { createEnvironmentalArea, loading: createEnvironmentalAreaLoading, toast: createEnvironmentalAreaToast } = useEnvironmentalAreaCreate();
    const { createEnvironmentalAreaProtocol, loading: createEnvironmentalAreaProtocolLoading, toast: createEnvironmentalAreaProtocolToast } = useEnvironmentalAreaProtocolCreate();

    const { updateEnvironmentalWasteCategory, loading: updateEnvironmentalWasteCategoryLoading, toast: updateEnvironmentalWasteCategoryToast } = useEnvironmentalWasteCategoryUpdate();
    const { updateEnvironmentalArea, loading: updateEnvironmentalAreaLoading, toast: updateEnvironmentalAreaToast } = useEnvironmentalAreaUpdate();
    const { updateEnvironmentalAreaProtocol, loading: updateEnvironmentalAreaProtocolLoading, toast: updateEnvironmentalAreaProtocolToast } = useEnvironmentalAreaProtocolUpdate();

    const { deleteEnvironmentalWasteCategory, loading: deleteEnvironmentalWasteCategoryLoading, toast: deleteEnvironmentalWasteCategoryToast } = useEnvironmentalWasteCategoryDelete();
    const { deleteEnvironmentalArea, loading: deleteEnvironmentalAreaLoading, toast: deleteEnvironmentalAreaToast } = useEnvironmentalAreaDelete();
    const { deleteEnvironmentalAreaProtocol, loading: deleteEnvironmentalAreaProtocolLoading, toast: deleteEnvironmentalAreaProtocolToast } = useEnvironmentalAreaProtocolDelete();

    const wasteCategoriesItems: EnvironmentalCalendarFilterItemInterface[] = wasteCategories.map((wasteCategory) => ({
        id: wasteCategory.id.toString(),
        name: wasteCategory.name,
        value: wasteCategory
    }));

    const areasItems: EnvironmentalCalendarFilterItemInterface[] = areas.map((area) => ({
        id: area.id.toString(),
        name: area.name,
        value: area
    }));

    const areaProtocolsItems: EnvironmentalCalendarFilterTreeItemInterface[] = areas.map((area) => ({
        id: area.id.toString(),
        name: area.name,
        value: area,
        subItems: area.protocols.map((protocol) => ({
            id: protocol.id.toString(),
            name: protocol.name,
            value: protocol
        })),
    }));

    const onAddWasteCategoryButtonClick = () => {
        setEditingItem(null);
        setFilterFormType('waste-category');
        setFilterFormTitle('Nuevo Registro');
        setFilterFormVisible(true);
    };

    const onAddAreaButtonClick = () => {
        setEditingItem(null);
        setFilterFormType('area');
        setFilterFormTitle('Nuevo Registro');
        setFilterFormVisible(true);
    };

    const onAddProtocolButtonClick = (area?: EnvironmentalCalendarFilterItemInterface) => {
        setEditingItem(null);
        if (area) {
            setSelectedArea(area);
        }
        setFilterFormType('protocol');
        setFilterFormTitle('Nuevo Registro');
        setFilterFormVisible(true);
    };

    const onWasteCategorySelect = (wasteCategory: EnvironmentalCalendarFilterItemInterface) => {
        setSelectedWasteCategory(wasteCategory);
    };

    const onAreaSelect = (area: EnvironmentalCalendarFilterItemInterface) => {
        setSelectedArea(area);
    };

    const onProtocolSelect = (protocol: EnvironmentalCalendarFilterItemInterface) => {
        setSelectedProtocol(protocol);
    };

    const onSubmitFilterForm = async (data: EnvironmentalCalendarFilterFormValues) => {
        switch (filterFormType) {
            case 'waste-category':
                if (editingItem) {
                    await updateEnvironmentalWasteCategory(editingItem.id, data);
                } else {
                    await createEnvironmentalWasteCategory(data);
                }
                refetchWasteCategories();
                break;
            case 'area':
                if (editingItem) {
                    await updateEnvironmentalArea(editingItem.id, data);
                } else {
                    await createEnvironmentalArea(data);
                }
                refetchAreas();
                break;
            case 'protocol':
                if (editingItem) {
                    await updateEnvironmentalAreaProtocol(editingItem.id, {
                        ...data,
                        environmental_area_id: selectedArea?.id || editingItem.value.environmental_area_id
                    });
                } else {
                    if (!selectedArea) {
                        throw new Error('El área es requerida');
                    }
                    await createEnvironmentalAreaProtocol({
                        ...data,
                        environmental_area_id: selectedArea.id
                    });
                }
                refetchAreas();
                break;
        }
        setFilterFormVisible(false);
        setEditingItem(null);
        // setSelectedArea(null); // Remove this to keep selection context if needed, or re-evaluate
    };

    const confirmDelete = (message: string, accept: () => void) => {
        if (window.confirm(message)) {
            accept();
        }
    }

    const onEditWasteCategory = (item: EnvironmentalCalendarFilterItemInterface) => {
        setEditingItem(item);
        setFilterFormType('waste-category');
        setFilterFormTitle('Editar Categoría');
        setFilterFormVisible(true);
    };

    const onDeleteWasteCategory = async (item: EnvironmentalCalendarFilterItemInterface) => {
        const confirmed = await deleteEnvironmentalWasteCategory(item.id);
        if (confirmed) {
            refetchWasteCategories();
        }
    };

    const onEditArea = (item: EnvironmentalCalendarFilterItemInterface) => {
        setEditingItem(item);
        setFilterFormType('area');
        setFilterFormTitle('Editar Área');
        setFilterFormVisible(true);
    };

    const onDeleteArea = async (item: EnvironmentalCalendarFilterItemInterface) => {
        const confirmed = await deleteEnvironmentalArea(item.id);
        if (confirmed) {
            refetchAreas();
        }
    };

    const onEditProtocol = (item: EnvironmentalCalendarFilterItemInterface) => {
        setEditingItem(item);
        setFilterFormType('protocol');
        setFilterFormTitle('Editar Protocolo');
        setFilterFormVisible(true);
    };

    const onDeleteProtocol = async (item: EnvironmentalCalendarFilterItemInterface) => {
        const confirmed = await deleteEnvironmentalAreaProtocol(item.id);
        if (confirmed) {
            refetchAreas();
        }
    };

    const onWasteCategoryInteract = (wasteCategory: EnvironmentalCalendarFilterItemInterface) => {
        setSelectedWasteCategory(wasteCategory);
    };

    const onAreaInteract = (area: EnvironmentalCalendarFilterItemInterface) => {
        setSelectedArea(area);
    };

    const onProtocolInteract = (protocol: EnvironmentalCalendarFilterItemInterface) => {
        setSelectedProtocol(protocol);
    };

    const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);

    const onIssuerSelect = (issuerId: string | null) => {
        setSelectedIssuer(issuerId);
    };

    return (<>
        <Toast ref={createEnvironmentalWasteCategoryToast} />
        <Toast ref={createEnvironmentalAreaToast} />
        <Toast ref={createEnvironmentalAreaProtocolToast} />
        <Toast ref={updateEnvironmentalWasteCategoryToast} />
        <Toast ref={updateEnvironmentalAreaToast} />
        <Toast ref={updateEnvironmentalAreaProtocolToast} />
        <Toast ref={deleteEnvironmentalWasteCategoryToast} />
        <Toast ref={deleteEnvironmentalAreaToast} />
        <Toast ref={deleteEnvironmentalAreaProtocolToast} />
        <div className='d-flex justify-content-between align-items-center gap-3 mb-3'>
            <h2 className="mb-0">Registros Ambientales</h2>
            <Button label="Nuevo Registro" icon={<i className="fa-solid fa-plus me-1" />} onClick={() => setRecordFormVisible(true)} />
        </div>
        <TabView>
            <TabPanel header="Residuos">
                <h3 className="mb-5">Residuos</h3>
                <EnvironmentalCalendarLayout
                    list={
                        <EnvironmentalWasteCategoryList
                            items={wasteCategoriesItems}
                            onAddWasteCategoryButtonClick={onAddWasteCategoryButtonClick}
                            onWasteCategorySelect={onWasteCategorySelect}
                            onEditWasteCategory={onEditWasteCategory}
                            onDeleteWasteCategory={onDeleteWasteCategory}
                            selectedItem={selectedWasteCategory}
                            onWasteCategoryInteract={onWasteCategoryInteract}
                            selectedIssuer={selectedIssuer}
                            onIssuerSelect={onIssuerSelect}
                        />
                    }
                    calendar={
                        <EnvironmentalCalendar
                            type="waste"
                            selectedCategory={selectedWasteCategory}
                            selectedIssuer={selectedIssuer}
                        />
                    }
                />
            </TabPanel>
            <TabPanel header="Temperatura">
                <h3 className="mb-5">Temperatura</h3>
                <EnvironmentalCalendarLayout
                    list={
                        <EnvironmentalAreaList
                            items={areasItems}
                            onAddAreaButtonClick={onAddAreaButtonClick}
                            onAreaSelect={onAreaSelect}
                            onEditArea={onEditArea}
                            onDeleteArea={onDeleteArea}
                            selectedItem={selectedArea}
                            onAreaInteract={onAreaInteract}
                        />
                    }
                    calendar={<EnvironmentalCalendar type="temperature" selectedArea={selectedArea} />}
                />
            </TabPanel>
            <TabPanel header="Humedad">
                <h3 className="mb-5">Humedad</h3>
                <EnvironmentalCalendarLayout
                    list={
                        <EnvironmentalAreaList
                            items={areasItems}
                            onAddAreaButtonClick={onAddAreaButtonClick}
                            onAreaSelect={onAreaSelect}
                            onEditArea={onEditArea}
                            onDeleteArea={onDeleteArea}
                            selectedItem={selectedArea}
                            onAreaInteract={onAreaInteract}
                        />
                    }
                    calendar={<EnvironmentalCalendar type="humidity" selectedArea={selectedArea} />}
                />
            </TabPanel>
            <TabPanel header="Limpieza y desinfección">
                <h3 className="mb-5">Limpieza y desinfección</h3>
                <EnvironmentalCalendarLayout
                    list={
                        <EnvironmentalAreaProtocolList
                            items={areaProtocolsItems}
                            onAddAreaButtonClick={onAddAreaButtonClick}
                            onAddProtocolButtonClick={onAddProtocolButtonClick}
                            onAreaSelect={onAreaSelect}
                            onProtocolSelect={onProtocolSelect}
                            onEditArea={onEditArea}
                            onDeleteArea={onDeleteArea}
                            onEditProtocol={onEditProtocol}
                            onDeleteProtocol={onDeleteProtocol}
                            selectedArea={selectedArea}
                            selectedProtocol={selectedProtocol}
                            onAreaInteract={onAreaInteract}
                            onProtocolInteract={onProtocolInteract}
                        />
                    }
                    calendar={<EnvironmentalCalendar type="cleaning" selectedProtocol={selectedProtocol} />}
                />
            </TabPanel>
        </TabView>

        <EnvironmentalFilterFormDialog
            visible={filterFormVisible}
            onHide={() => {
                setFilterFormVisible(false);
                setEditingItem(null);
            }}
            onSubmit={onSubmitFilterForm}
            type={filterFormType}
            title={filterFormTitle}
            loading={createEnvironmentalWasteCategoryLoading || createEnvironmentalAreaLoading || createEnvironmentalAreaProtocolLoading || updateEnvironmentalWasteCategoryLoading || updateEnvironmentalAreaLoading || updateEnvironmentalAreaProtocolLoading}
            initialValues={editingItem ? { name: editingItem.name } : undefined}
        />

        <EnvironmentalRecordFormDialog
            visible={recordFormVisible}
            onHide={() => setRecordFormVisible(false)}
        />
    </>);
};