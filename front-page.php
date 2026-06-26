<?php
/**
 * Front page template — used for the site's home page.
 * Mounts the React app and tells it to render the "home" page component.
 */
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="home">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
