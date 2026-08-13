<?php
/**
 * Template Name: EA Pickleball Adult Waiver
 * Template Post Type: page
 */
get_header();
?>

<main id="ea-waiver-content" class="ea-waiver-content">
    <article class="ea-waiver-content__article">
        <?php ea_render_waiver_form( 'adult' ); ?>
    </article>
</main>

<?php get_footer(); ?>
