<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div id="entregaInsumosRoot"></div>
</div>

<script type="module">
    import {
        ProductsDelivery
    } from './react-dist/pharmacy/delivery/ProductsDelivery.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(ProductsDelivery, "entregaInsumosRoot");
</script>

<?php include "../../footer.php"; ?>