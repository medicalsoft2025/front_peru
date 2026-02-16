<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Estado De Resultados</li>
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
        StatusResult
    } from './react-dist/billing/reports/StatusResult.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(StatusResult, "estadoResultados");
</script>



<?php include "../../../footer.php"; ?>