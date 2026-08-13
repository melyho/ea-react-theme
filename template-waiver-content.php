<?php
/**
 * Template Name: EA Waiver Content
 * Template Post Type: page
 *
 * Direct WordPress content shell for waiver forms. This avoids moving form
 * markup through React so WPForms shortcodes and scripts can render normally.
 */
get_header();
?>

<?php
while ( have_posts() ) :
    the_post();
    ?>
    <main id="ea-waiver-content" class="ea-waiver-content">
        <article class="ea-waiver-content__article">
            <header class="ea-waiver-content__header">
                <h1 class="ea-waiver-content__title"><?php the_title(); ?></h1>
            </header>
            <div class="ea-waiver-content__body">
                <?php the_content(); ?>
            </div>
        </article>
    </main>
    <?php
endwhile;
?>

<?php get_footer(); ?>
