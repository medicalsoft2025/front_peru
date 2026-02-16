<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Balance de Prueba X Tercero</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="balancePruebaTercero"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        BalanceThirdParty
    } from './react-dist/billing/reports/BalanceThirdParty.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(BalanceThirdParty, "balancePruebaTercero");
</script>



<?php include "../../../footer.php"; ?>