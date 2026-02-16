<?php
include "../../menu.php";
include "../../header.php";
?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Reportes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Reportes Especialista</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="report-invoices-doctors"></div>
            </div>
        </div>
    </div>
</div>


<script type="module">
    import {
        SpecialistsReport
    } from './react-dist/reports/InvoicesDoctors.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SpecialistsReport, 'report-invoices-doctors');
</script>

<?php
include "../../footer.php";
?>