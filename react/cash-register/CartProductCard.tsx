import React from "react";
import { CashRegisterProduct } from "./interfaces";
import { formatPrice } from "../../services/utilidades";
import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const discountTypeOptions = [
    { label: '%', value: 'percentage' },
    { label: '$', value: 'value' }
];

interface CartProductCardProps {
    product: CashRegisterProduct;
    removeFromCart: (product: CashRegisterProduct) => void;
    onQuantityChange: (product: CashRegisterProduct, quantity: number) => void;
    onDiscountChange: (product: CashRegisterProduct, discountType: 'percentage' | 'value', discountAmount: number) => void;
}

export const CartProductCard = (props: CartProductCardProps) => {
    const { product, removeFromCart, onQuantityChange, onDiscountChange } = props;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;

        if (product.pharmacy_available_stock && product.pharmacy_product_stock > 0) {
            if (newQuantity > product.pharmacy_product_stock) return;
        }

        onQuantityChange(product, newQuantity);
    };

    const incrementQuantity = () => {
        handleQuantityChange(product.quantity + 1);
    };

    const decrementQuantity = () => {
        handleQuantityChange(product.quantity - 1);
    };

    const calculateTotal = () => {
        const subtotal = product.price * product.quantity;
        return subtotal - (product.discountCalculated ?? 0);
    };

    const handleDiscountTypeChange = (type: 'percentage' | 'value') => {
        onDiscountChange(product, type, product.discountAmount);
    };

    const handleDiscountAmountChange = (amount: number) => {
        onDiscountChange(product, product.discountType, amount ?? 0);
    };

    return (
        <div className="card h-100 border-0">
            <div className="card-body d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title fw-bold text-primary mb-0 line-clamp-2 flex-grow-1 me-2">
                        {product.name}
                    </h6>
                    <Tooltip target=".add-to-cart-btn" />
                    <div
                        className="add-to-cart-btn"
                        data-pr-tooltip={'Eliminar producto'}
                        data-pr-position="left"
                    >
                        <Button
                            className="p-button-danger"
                            size="small"
                            onClick={() => removeFromCart(product)}
                            icon={<i className="fas fa-trash" />}
                        />
                    </div>
                </div>

                <div className="row small text-muted g-2 mb-3">
                    {product.presentation && (
                        <div className="col-12">
                            <i className="fas fa-box me-1"></i>
                            <strong>Presentación:</strong> {product.presentation}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <div className="d-flex">
                            <Button
                                className="p-button-secondary"
                                size="small"
                                onClick={decrementQuantity}
                                disabled={product.quantity <= 1}
                                type="button"
                                icon={<i className="fas fa-minus"></i>}
                            />
                        </div>

                        <div className="d-flex flex-grow-1">
                            <InputNumber
                                className="mx-2 w-100"
                                inputClassName="w-100"
                                placeholder="Cantidad"
                                value={product.quantity}
                                onValueChange={(e) => handleQuantityChange(e.value || 1)}
                                onChange={(e) => handleQuantityChange(e.value || 1)}
                                min={1}
                                max={product.pharmacy_product_stock || undefined}
                            />
                        </div>

                        <div className="d-flex">
                            <Button
                                className="p-button-secondary"
                                size="small"
                                onClick={incrementQuantity}
                                disabled={
                                    product.pharmacy_available_stock &&
                                    product.quantity >= product.pharmacy_product_stock
                                }
                                type="button"
                                icon={<i className="fas fa-plus"></i>}
                            />
                        </div>
                    </div>

                    {product.pharmacy_available_stock && (
                        <small className="text-muted">
                            <i className="fas fa-cubes me-1"></i>
                            Stock disponible: {product.pharmacy_product_stock}
                        </small>
                    )}
                </div>

                {/* Sección de descuento */}
                <div className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <small className="text-muted me-1">
                            <i className="fas fa-tag me-1"></i>
                            Descuento:
                        </small>
                        <Dropdown
                            value={product.discountType}
                            options={discountTypeOptions}
                            onChange={(e) => handleDiscountTypeChange(e.value)}
                            style={{ width: '75px' }}
                        />
                        <InputNumber
                            value={product.discountAmount}
                            onValueChange={(e) => handleDiscountAmountChange(e.value ?? 0)}
                            min={0}
                            max={
                                product.discountType === 'percentage'
                                    ? 100
                                    : product.price * product.quantity
                            }
                            minFractionDigits={0}
                            maxFractionDigits={2}
                            placeholder="0"
                            className="flex-grow-1"
                            inputClassName="w-100"
                        />
                    </div>

                    {/* Muestra el valor descontado solo si hay descuento */}
                    {product.discountCalculated > 0 && (
                        <small className="text-danger mt-1 d-block">
                            <i className="fas fa-arrow-down me-1"></i>
                            Descuento aplicado: - {formatPrice(product.discountCalculated)}
                        </small>
                    )}
                </div>

                <div className="mt-auto border-top pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted">Precio unitario:</span>
                        <span className="small text-muted">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    {/* Muestra el subtotal tachado solo si hay descuento */}
                    {product.discountCalculated > 0 && (
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small text-muted">Subtotal:</span>
                            <span className="small text-muted text-decoration-line-through">
                                {formatPrice(product.price * product.quantity)}
                            </span>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-dark">Total:</span>
                        <span className={`fw-bold fs-6 ${product.discountCalculated > 0 ? 'text-success' : ''}`}>
                            {formatPrice(calculateTotal())}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};