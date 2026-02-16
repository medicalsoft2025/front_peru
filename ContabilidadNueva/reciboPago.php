<?php
include "../menu.php";
include "../header.php";
?>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Recibo Pago</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <h2>Contable</h2>
                <div id="paymentReceipts"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import {
        PaymentReceiptForm
    } from './react-dist/accounting/paymentReceipt/PaymentReceiptForm.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PaymentReceiptForm, "paymentReceipts");
</script>
<?php
include "../footer.php";
?>