<?php
include "../../../menu.php";
include "../../../header.php";


?>
<style>
    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 0.5rem;
    }
</style>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Balance de prueba x Cuenta Contable</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="balanceCuentaContable"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import {
        BalanceAccountingAccount
    } from './react-dist/billing/reports/BalanceAccountingAccount.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(BalanceAccountingAccount, "balanceCuentaContable");
</script>



<?php include "../../../footer.php"; ?>