<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="homeInventario">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Marcas</li>
                </ol>
            </nav>
            <div class="pb-9">

                <div id="brandsProductsAppReact"></div>

            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        BrandsApp
    } from './react-dist/inventory/brands/BrandsApp.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(BrandsApp, "brandsProductsAppReact");
</script>

<?php include "../footer.php";
?>