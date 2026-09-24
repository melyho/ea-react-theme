<?php
/**
 * Template Name: EA City Programs + Free Trial
 * Template Post Type: page
 *
 * City page variant. It uses the same city filtering as EA City Programs, then
 * adds a free-trial submission form above the program cards.
 */
$ea_slug = get_post_field( 'post_name', get_queried_object_id() );
get_header(); ?>

<main
    id="ea-react-root"
    class="ea-react-root"
    data-page="cityProgramsFreeTrial"
    data-city-slug="<?php echo esc_attr( $ea_slug ); ?>"
    data-wp-slug="<?php echo esc_attr( $ea_slug ); ?>"
>
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
