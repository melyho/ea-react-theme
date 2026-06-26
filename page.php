<?php
/**
 * Page template — used for every WordPress Page.
 * The page's slug (e.g. /about/ → "about") is handed to React via data-page,
 * and src/main.jsx renders the component registered under that slug.
 * Unknown slugs fall back to the home page component.
 */
$ea_slug = get_post_field( 'post_name', get_queried_object_id() );
get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="<?php echo esc_attr( $ea_slug ); ?>">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
