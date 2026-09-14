<?php
/**
 * Template Name: EA Volleyball Page
 * Template Post Type: page
 *
 * Standalone volleyball landing/programs page. React owns the layout while
 * WordPress provides the asset shell and Customizer data.
 */
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="volleyball">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
