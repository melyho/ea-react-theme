<?php
/**
 * Template Name: EA Rep Development Teams
 * Template Post Type: page
 *
 * Editable basketball rep development teams page. React owns the layout; PHP
 * renders the optional WPForms shortcode so form plugins can enqueue assets.
 */
get_header();

$ea_rep_development_form_shortcode = get_theme_mod( 'ea_rep_development_form_shortcode', '' );
?>

<main id="ea-react-root" class="ea-react-root" data-page="repDevelopmentTeams">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<div id="ea-rep-development-form-template" hidden>
    <?php
    if ( '' !== trim( $ea_rep_development_form_shortcode ) ) {
        echo do_shortcode( $ea_rep_development_form_shortcode );
    }
    ?>
</div>

<?php get_footer(); ?>
