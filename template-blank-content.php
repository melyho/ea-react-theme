<?php
/**
 * Template Name: EA Blank Content
 * Template Post Type: page
 *
 * A lightweight content page for internal/reference content.
 * WordPress provides the content; React wraps it in the universal Layout so the
 * normal nav and footer remain consistent with every other page.
 */
get_header(); ?>

<?php
while ( have_posts() ) :
    the_post();
    ?>
<main
    id="ea-react-root"
    class="ea-react-root"
    data-page="blank"
    data-title="<?php echo esc_attr( get_the_title() ); ?>"
>
    <template id="ea-blank-content-template">
        <?php the_content(); ?>
    </template>
    <noscript>
        <article class="ea-blank-content__article">
            <header class="ea-blank-content__header">
                <h1 class="ea-blank-content__title"><?php the_title(); ?></h1>
            </header>
            <div class="ea-blank-content__body">
                <?php the_content(); ?>
            </div>
        </article>
    </noscript>
</main>
    <?php
endwhile;
?>

<?php get_footer(); ?>
