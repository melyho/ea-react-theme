<?php
/**
 * Template Name: EA Basketball Guide
 * Template Post Type: page
 *
 * A customizable basketball guide / program overview page. React owns the
 * layout; WordPress provides the shared nav/footer shell and Customizer data.
 */
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="basketballGuide">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
