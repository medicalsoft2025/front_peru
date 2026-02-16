<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="TaxReports">Reportes Fiscales</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">
                    606 - compras
                </li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="report606Purchases"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import {
        Report606Purchases
    } from './react-dist/billing/tax-reports/Report606Purchases.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(Report606Purchases, "report606Purchases");
</script>



<?php include "../../../footer.php"; ?>