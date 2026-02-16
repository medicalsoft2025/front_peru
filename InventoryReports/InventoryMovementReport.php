<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="inventoryMovementModalRoot"></div>
    </div>
</div>

<script type="module">
    import {
        InventoryMovementReport
    } from './react-dist/inventory/reports/InventoryMovementReport.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(InventoryMovementReport, "inventoryMovementModalRoot");
</script>

<?php include "../footer.php"; ?>