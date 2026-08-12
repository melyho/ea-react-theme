<?php
/**
 * Template Name: EA Basketball Rep Tryouts
 * Template Post Type: page
 *
 * Editable basketball rep tryouts page. React owns the layout; PHP renders the
 * optional WPForms shortcode so form plugins can enqueue their own assets.
 */
get_header();

$ea_rep_form_shortcode = get_theme_mod( 'ea_txt_basketball_rep_form_shortcode', '' );
?>

<main id="ea-react-root" class="ea-react-root" data-page="basketballRepTryouts">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<div id="ea-rep-tryouts-form-template" hidden>
    <?php
    if ( '' !== trim( $ea_rep_form_shortcode ) ) {
        echo do_shortcode( $ea_rep_form_shortcode );
    }
    ?>
</div>

<?php get_footer(); ?>
