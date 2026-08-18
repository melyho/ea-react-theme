<?php
/**
 * Front page template — used for the site's home page.
 *
 * The root elevationathletics.ca page is the standalone EA Directory. The full
 * basketball landing page still lives at /home through page.php, where the
 * WordPress slug hands React data-page="home".
 */
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="directoryHome">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
