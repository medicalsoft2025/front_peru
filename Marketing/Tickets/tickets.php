<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeMarketing">Marketing</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Tickets de Soporte
                </li>
            </ol>
        </nav>
        <div class="w-full">
            <h2 class="section-title">Tickets de Soporte</h2>

            <div id="ticketsApp"></div>
        </div>
    </div>
</div>

<?php
include "../../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        TicketsApp
    } from './react-dist/marketing/tickets/TicketsApp.js';

    ReactDOMClient.createRoot(document.getElementById('ticketsApp')).render(React.createElement(TicketsApp));
</script>
