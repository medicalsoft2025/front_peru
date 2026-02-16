import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm, Controller } from 'react-hook-form';
import { useDeposits } from '../../deposits/hooks/useDeposits';
import { useTransferProducts } from './hooks/useTransferProducts';
import { useTransferLots } from './hooks/useTransferLots';
import { useCreateTransfer } from './hooks/useCreateTransfer';
import { TransferPayload } from './interfaces/TransferInterfaces';

interface InventoryTransferModalProps {
    visible: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

export const InventoryTransferModal: React.FC<InventoryTransferModalProps> = ({ visible, onHide, onSuccess }) => {
    const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<TransferPayload>({
        defaultValues: {
            quantity: 1
        }
    });

    const { createTransfer, loading: submitting } = useCreateTransfer();

    // Watchers for dependencies
    const sourceDepositId = watch('source_deposit_id');
    const productId = watch('product_id');

    // Hooks
    const { deposits } = useDeposits();
    // Wrap deps in hook logic
    const { products, loading: loadingProducts } = useTransferProducts(sourceDepositId || null);
    const { lots: sourceLots, loading: loadingSourceLots } = useTransferLots(productId || null, sourceDepositId || null);

    // Derived helpers
    const selectedProduct = products.find(p => p.id === productId);
    const hasLots = selectedProduct?.has_lots;

    // Reset dependant fields when parent changes
    useEffect(() => {
        if (sourceDepositId) {
            setValue('product_id', null);
            setValue('lot_id', null);
            setValue('source_lot_id', null);
        }
    }, [sourceDepositId, setValue]);

    useEffect(() => {
        if (productId) {
            setValue('lot_id', null);
            setValue('source_lot_id', null);
        }
    }, [productId, setValue]);

    const onSubmit = (data: TransferPayload) => {
        // Validation refinement if needed
        if (data.source_lot_id) {
            data.lot_id = data.source_lot_id;
        }

        createTransfer(data).then((res) => {
            if (res.success) {
                reset();
                onSuccess();
                onHide();
            } else {
                alert("Error: " + res.message);
            }
        });
    };

    const dialogFooter = (
        <div>
            <Button label="Cancelar" className="p-button-text p-button-secondary" onClick={onHide}>
                <i className="fas fa-times me-2"></i>
            </Button>
            <Button label="Transferir" className="p-button-primary" onClick={handleSubmit(onSubmit)} loading={submitting}>
                <i className="fas fa-check me-2"></i>
            </Button>
        </div>
    );

    const depositOptions = deposits.map((d: any) => ({ label: d.attributes.name, value: d.id }));
    const productOptions = products.map(p => ({ label: `${p.name} (Stock: ${p.stock})`, value: p.id }));
    const lotOptions = sourceLots.map(l => ({ label: `${l.lot_number} (Exp: ${l.expiration_date}, Stock: ${l.stock})`, value: l.id }));

    return (
        <Dialog header="Traslado de Inventario" visible={visible} style={{ width: '50vw' }} footer={dialogFooter} onHide={onHide}>
            <form className="row g-3">

                {/* Source Deposit */}
                <div className="col-md-6">
                    <label htmlFor="source_deposit" className="form-label">Depósito Origen</label>
                    <Controller
                        name="source_deposit_id"
                        control={control}
                        rules={{ required: 'Depósito Origen es requerido' }}
                        render={({ field }) => (
                            <Dropdown
                                id="source_deposit"
                                {...field}
                                options={depositOptions}
                                placeholder="Seleccione Origen"
                                filter
                                className={`w-100 ${errors.source_deposit_id ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.source_deposit_id && <small className="text-danger">{errors.source_deposit_id.message}</small>}
                </div>

                {/* Destination Deposit */}
                <div className="col-md-6">
                    <label htmlFor="dest_deposit" className="form-label">Depósito Destino</label>
                    <Controller
                        name="destination_deposit_id"
                        control={control}
                        rules={{
                            required: 'Depósito Destino es requerido',
                            validate: (value) => value !== sourceDepositId || "El destino no puede ser igual al origen"
                        }}
                        render={({ field }) => (
                            <Dropdown
                                id="dest_deposit"
                                {...field}
                                options={depositOptions}
                                placeholder="Seleccione Destino"
                                filter
                                className={`w-100 ${errors.destination_deposit_id ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.destination_deposit_id && <small className="text-danger">{errors.destination_deposit_id.message}</small>}
                </div>

                {/* Product */}
                <div className="col-12">
                    <label htmlFor="product" className="form-label">Producto</label>
                    <Controller
                        name="product_id"
                        control={control}
                        rules={{ required: 'Producto es requerido' }}
                        render={({ field }) => (
                            <Dropdown
                                id="product"
                                {...field}
                                options={productOptions}
                                placeholder="Seleccione Producto"
                                filter
                                disabled={!sourceDepositId}
                                loading={loadingProducts}
                                className={`w-100 ${errors.product_id ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.product_id && <small className="text-danger">{errors.product_id.message}</small>}
                </div>

                {/* Source Lot (If Product has lots) */}
                {hasLots && (
                    <div className="col-md-6">
                        <label htmlFor="source_lot" className="form-label">Lote Origen</label>
                        <Controller
                            name="source_lot_id"
                            control={control}
                            rules={{ required: 'Lote de origen es requerido' }}
                            render={({ field }) => (
                                <Dropdown
                                    id="source_lot"
                                    {...field}
                                    options={lotOptions}
                                    placeholder="Seleccione Lote"
                                    loading={loadingSourceLots}
                                    className={`w-100 ${errors.source_lot_id ? 'p-invalid' : ''}`}
                                />
                            )}
                        />
                        {errors.source_lot_id && <small className="text-danger">{errors.source_lot_id.message}</small>}
                    </div>
                )}

                {/* Quantity */}
                <div className="col-md-6">
                    <label htmlFor="quantity" className="form-label">Cantidad</label>
                    <Controller
                        name="quantity"
                        control={control}
                        rules={{ required: 'Cantidad es requerida', min: 1 }}
                        render={({ field }) => (
                            <InputNumber
                                id="quantity"
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                showButtons
                                min={1}
                                className={`w-100 ${errors.quantity ? 'p-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.quantity && <small className="text-danger">{errors.quantity.message}</small>}
                </div>

                {/* Notes */}
                <div className="col-12">
                    <label htmlFor="notes" className="form-label">Notas</label>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea id="notes" {...field} rows={3} autoResize className="w-100" />
                        )}
                    />
                </div>

            </form>
        </Dialog>
    );
};
