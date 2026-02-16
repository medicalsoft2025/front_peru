<?php
include "../menu.php";
include "../header.php";
?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Facturacion</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="tabs-invoices"></div>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>

<script type="module">
    import { TabsBilling }
        from './react-dist/billing/TabsBilling.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(TabsBilling, "tabs-invoices");
</script>