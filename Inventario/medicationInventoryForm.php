<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeInventario">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Medicamentos</li>
                </ol>
            </nav>
            <div id="productInventoryAppReact"></div>
        </div>
    </div>
</div>

<script type="module">
    import {
        MedicationInventoryForm
    } from './react-dist/products/MedicationInventoryForm.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(MedicationInventoryForm, "productInventoryAppReact");
</script>

<?php
include "../footer.php";
?>