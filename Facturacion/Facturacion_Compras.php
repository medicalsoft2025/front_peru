<?php
include "../menu.php";
include "../header.php";


?>

<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="FE_FCE">Facturacion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Factura Compras</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="FacturacionCompras"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        PurchaseBilling
    } from './react-dist/billing/purchase_billing/PurchaseBilling.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PurchaseBilling, "FacturacionCompras");
</script>



<?php include "../footer.php";
include "../Inventario/modal/modalNuevoInsumo.php";
?>