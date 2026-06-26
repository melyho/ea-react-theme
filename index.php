<?php get_header(); ?>

<?php
// Fallback template (blog index, archives, 404, etc.). Map a known page slug to a
// React component when available; otherwise the home page renders.
$ea_slug = ( is_page() ) ? get_post_field( 'post_name', get_queried_object_id() ) : 'home';
?>
<main id="ea-react-root" class="ea-react-root" data-page="<?php echo esc_attr( $ea_slug ); ?>">
    <noscript>
        <p><?php esc_html_e( 'React requires JavaScript to render this page. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
