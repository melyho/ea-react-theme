<?php
/**
 * Front page template — used for the site's home page.
 *
 * WordPress gives front-page.php priority over a selected page template when a
 * page is assigned as the static homepage. Honor the selected template here so
 * a homepage can still use special React views like the EA Directory.
 */
$ea_page = 'home';
$ea_template = get_page_template_slug( get_queried_object_id() );

if ( 'template-directory-home.php' === $ea_template ) {
    $ea_page = 'directoryHome';
}

get_header(); ?>

<main id="ea-react-root" class="ea-react-root" data-page="<?php echo esc_attr( $ea_page ); ?>">
    <noscript>
        <p><?php esc_html_e( 'This site requires JavaScript to display. Please enable JavaScript in your browser.', 'ea-react-theme' ); ?></p>
    </noscript>
</main>

<?php get_footer(); ?>
