<?php
/**
 * Template Name: EA League Hub
 * Template Post Type: page
 *
 * A searchable program hub powered by the public programs.json feed. React owns
 * the UI; WordPress provides the universal nav/footer shell and template picker.
 */
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="leagueHub">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
