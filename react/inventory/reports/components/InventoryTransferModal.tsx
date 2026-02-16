import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateTransfer } from '../hooks/useCreateTransfer';
import { BulkTransferPayload } from '../services/InventoryTransferService';
import { useDeposits } from '../../deposits/hooks/useDeposits';
import { TransferRow } from './TransferRow';

interface InventoryTransferModalProps {
    visible: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

export const InventoryTransferModal: React.FC<InventoryTransferModalProps> = ({ visible, onHide, onSuccess }) => {
    const { deposits, loading: loadingDeposits } = useDeposits();
    const { createTransfer, loading: submitting } = useCreateTransfer();

    // Global destination control state
    const [globalDestinationId, setGlobalDestinationId] = useState<number | null>(null);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BulkTransferPayload>({
        defaultValues: {
            transfers: [{
                source_deposit_id: 0,
                destination_deposit_id: 0,
                product_id: 0,
                quantity: 1,
                lot_id: null,
                source_lot_id: null,
                destination_lot_id: null
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "transfers"
    });

    // Watch all fields to calculate used stock in real-time
    const currentTransfers = watch('transfers');

    // Callback to get used stock for a specific product/lot EXCLUDING the current row
    // This allows the current row to see how much is used by OTHERS to subtract from total
    const getUsedStock = useCallback((productId: number, lotId: number | null | undefined, rowIndex: number) => {
        let used = 0;
        currentTransfers.forEach((transfer, index) => {
            if (index !== rowIndex && transfer.product_id === productId) {
                // If product matches:
                // 1. If lotId is provided (lot managed), both must match lot_id
                // 2. If lotId is null (not lot managed), just product match is enough
                if (lotId) {
                    // Check if transfer.source_lot_id matches (using source_lot_id as primary for source)
                    // Note: In logic we use source_lot_id for source lot usually
                    if (transfer.source_lot_id === lotId) {
                        used += (transfer.quantity || 0);
                    }
                } else {
                    used += (transfer.quantity || 0);
                }
            }
        });
        return used;
    }, [currentTransfers]);


    // Reset form when modal opens/closes
    useEffect(() => {
        if (!visible) {
            reset({
                transfers: [{
                    source_deposit_id: 0,
                    destination_deposit_id: 0,
                    product_id: 0,
                    quantity: 1,
                    lot_id: null,
                    source_lot_id: null,
                    destination_lot_id: null
                }]
            });
            setGlobalDestinationId(null);
        }
    }, [visible, reset]);

    const onSubmit = async (data: BulkTransferPayload) => {
        try {
            await createTransfer(data);
            onSuccess();
            onHide();
        } catch (error) {
            console.error("Transfer failed", error);
        }
    };

    const handleApplyGlobalDestination = () => {
        if (globalDestinationId) {
            fields.forEach((_, index) => {
                setValue(`transfers.${index}.destination_deposit_id`, globalDestinationId);
                setValue(`transfers.${index}.destination_lot_id`, null);
            });
        }
    };

    const depositOptions = deposits.map((d: any) => ({ label: d.attributes.name, value: d.id }));

    // Determine modal width based on screen size (responsive)
    // Using a class or style for width

    const dialogFooter = (
        <div>
            <Button label="Cancelar xd" icon={<i className="fas fa-times me-2"></i>} onClick={onHide} className="p-button-text" />
            <Button
                label="Transferir"
                icon={<i className="fas fa-exchange-alt me-2"></i>}
                onClick={handleSubmit(onSubmit)}
                autoFocus
            />
        </div>
    );

    return (
        <Dialog
            header="Realizar Traslado de Inventario"
            visible={visible}
            style={{ width: '90vw', maxWidth: '1200px' }}
            footer={dialogFooter}
            onHide={onHide}
            maximized={false}
            className="inventory-transfer-modal"
        >
            <div className="container-fluid">
                {/* Global Controls */}
                <div className="row mb-4 align-items-end p-3 bg-light rounded shadow-sm">
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label fw-bold">Pre-seleccionar Destino (Opcional)</label>
                        <Dropdown
                            value={globalDestinationId}
                            options={depositOptions}
                            onChange={(e) => setGlobalDestinationId(e.value)}
                            placeholder="Seleccione un destino para todos"
                            filter
                            className="w-100"
                            showClear
                        />
                    </div>
                    <div className="col-md-4 col-lg-3 mt-2 mt-md-0">
                        <Button
                            label="Aplicar a todos"
                            icon={<i className="fas fa-check-double me-2"></i>}
                            onClick={handleApplyGlobalDestination}
                            disabled={!globalDestinationId}
                            className="p-button-secondary w-100"
                        />
                    </div>
                </div>

                {/* Rows as Cards */}
                <div className="transfer-rows-container">
                    {fields.map((field, index) => (
                        <TransferRow
                            key={field.id}
                            index={index}
                            control={control}
                            setValue={setValue}
                            watch={watch}
                            remove={remove}
                            deposits={deposits}
                            isOnlyRow={fields.length === 1}
                            getUsedStock={getUsedStock}
                        />
                    ))}
                </div>

                <div className="mt-3 text-center">
                    <Button
                        label="Agregar Ítem"
                        icon={<i className="fas fa-plus me-2"></i>}
                        onClick={() => append({
                            source_deposit_id: 0,
                            destination_deposit_id: globalDestinationId || 0,
                            product_id: 0,
                            quantity: 1,
                            lot_id: null,
                            source_lot_id: null,
                            destination_lot_id: null
                        })}
                        className="p-button-outlined w-100 p-3"
                        style={{ borderStyle: 'dashed' }}
                    />
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger mt-3">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        Por favor corrija los errores en las filas marcadas.
                    </div>
                )}
            </div>
        </Dialog>
    );
};
