<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeFarmacia">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Solicitud de insumos</li>
                </ol>
            </nav>

            <div class="pb-9">
                <div class="row mt-5">
                    <div class="col-md-12">
                        <h2 class="mb-3">Solicitud de insumos</h2>

                        <div id="suppliesDeliveriesReact"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        SuppliesDeliveries
    } from './react-dist/pharmacy/supplies/SuppliesDeliveries.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SuppliesDeliveries, "suppliesDeliveriesReact");
</script>

<?php include "../../footer.php";
?>