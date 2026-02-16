<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="VoiceButton"></div>
    </div>
</div>

<script type="module">
    import {
        VoiceButton
    } from './react-dist/components/VoiceButton.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(VoiceButton, 'VoiceButton');
</script>

<?php include "../footer.php"; ?>