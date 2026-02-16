<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import {
        userService
    } from "./services/api/index.js";

    // Test the cached user service
    async function testCachedUser() {
        try {
            const user = await userService.getCachedLoggedUser();
            console.log('Cached user:', user);
        } catch (error) {
            console.error('Error getting cached user:', error);
        }
    }

    testCachedUser();
</script>

<?php include "../footer.php"; ?>