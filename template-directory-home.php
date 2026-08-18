<?php
/**
 * Template Name: EA Directory Home
 * Template Post Type: page
 *
 * Standalone Elevation Athletics directory page. It intentionally omits the
 * React Layout nav/footer while keeping the WordPress asset shell.
 */
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="directoryHome">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
