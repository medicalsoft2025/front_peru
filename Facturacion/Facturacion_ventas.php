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
                <li class="breadcrumb-item active" onclick="location.reload()">Factura Ventas</li>
            </ol>
        </nav>
        <div class="main-content">
            <div id="FacturacionVentas"></div>
        </div>
    </div>
</div>

<script type="module">
    import {
        SalesBilling
    } from './react-dist/billing/sales_billing/SalesBilling.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SalesBilling, "FacturacionVentas");
</script>



<?php include "../footer.php"; ?>