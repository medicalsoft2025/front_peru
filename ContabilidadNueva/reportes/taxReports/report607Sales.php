<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="TaxReports">Reportes Fiscales</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">607 - ventas</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="estadoResultados"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import {
        Report607Sales
    } from './react-dist/billing/tax-reports/Report607Sales.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(Report607Sales, "estadoResultados");
</script>



<?php include "../../../footer.php"; ?>