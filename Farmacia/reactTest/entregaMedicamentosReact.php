<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div id="entregaMedicamentosRoot"></div>
</div>

<script type="module">
    import {
        ProductsDelivery
    } from './react-dist/pharmacy/medication-delivery/MedicationsDelivery.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(ProductsDelivery, "entregaMedicamentosRoot");
</script>

<?php include "../../footer.php"; ?>