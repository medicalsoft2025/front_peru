<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="medicalSuppliesModalRoot"></div>
    </div>
</div>

<script type="module">
    import {
        UserSupplyStockReport
    } from './react-dist/medical-supplies/UserMedicalSuppliesReport.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(UserSupplyStockReport, 'medicalSuppliesModalRoot');
</script>

<?php include "../footer.php"; ?>