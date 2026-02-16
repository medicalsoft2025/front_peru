<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Movimiento Auxiliar x Cuenta Contable
                </li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="movimientoAuxiliar"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import {
        AuxiliaryMovement
    } from './react-dist/billing/reports/AuxiliaryMovement.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(AuxiliaryMovement, "movimientoAuxiliar");
</script>



<?php include "../../../footer.php"; ?>