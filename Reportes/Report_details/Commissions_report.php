<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">

        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Reportes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Bonificaciones</li>
            </ol>
        </nav>
        <div id="report-commissions"></div>

    </div>
</div>
<script type="module">
    import {
        Commissions
    } from './react-dist/reports/Commissions.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(Commissions, 'report-commissions');
</script>

<?php
include "../../footer.php";
?>