<?php
include "../../../menu.php";
include "../../../header.php";
?>



<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Libro mayor de balance
                </li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="generalLedgerBalanceReport"></div>
            </div>
        </div>
    </div>
</div>
<?php
include "../../../footer.php";
?>

<script type="module">
    import {
        GeneralLedgerBalance
    } from './react-dist/billing/reports/GeneralLedgerBalance.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(GeneralLedgerBalance, "generalLedgerBalanceReport");
</script>