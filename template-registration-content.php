<?php
/**
 * Template Name: EA Registration Content
 * Template Post Type: page
 *
 * A stripped-down shell for hosted registration forms. It keeps a universal EA
 * header, hides the WordPress page title, renders the page content, and omits
 * the public marketing footer.
 */
get_header();

$logo_url  = get_theme_mod( 'ea_registration_nav_logo', get_template_directory_uri() . '/assets/images/registration-logo.svg' );
$logo_href = get_theme_mod( 'ea_registration_nav_logo_url', 'https://elevationathletics.ca/' );
$links     = ea_registration_nav_links();
?>

<header class="ea-registration-header">
    <a class="ea-registration-header__logo" href="<?php echo esc_url( $logo_href ); ?>">
        <img src="<?php echo esc_url( $logo_url ); ?>" alt="<?php esc_attr_e( 'Elevation Athletics', 'ea-react-theme' ); ?>">
    </a>

    <?php if ( ! empty( $links ) ) : ?>
        <nav class="ea-registration-header__nav" aria-label="<?php esc_attr_e( 'Registration sports navigation', 'ea-react-theme' ); ?>">
            <?php foreach ( $links as $link ) : ?>
                <?php if ( empty( $link['label'] ) || empty( $link['url'] ) ) continue; ?>
                <a href="<?php echo esc_url( $link['url'] ); ?>"><?php echo esc_html( $link['label'] ); ?></a>
            <?php endforeach; ?>
        </nav>
    <?php endif; ?>
</header>

<?php
while ( have_posts() ) :
    the_post();
    ?>
    <main id="ea-registration-content" class="ea-registration-content">
        <article class="ea-registration-content__article">
            <?php the_content(); ?>
        </article>
    </main>
    <?php
endwhile;

wp_footer();
?>
</body>
</html>
