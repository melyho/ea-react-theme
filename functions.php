<?php
/**
 * Elevation Athletics React Theme — functions.php
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ea_react_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'script', 'style' ) );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'ea-react-theme' ),
        'footer'  => __( 'Footer Menu', 'ea-react-theme' ),
    ) );
}
add_action( 'after_setup_theme', 'ea_react_theme_setup' );

function ea_react_get_menu_items( $location ) {
    $locations = get_nav_menu_locations();
    if ( empty( $locations[ $location ] ) ) return array();
    $menu = wp_get_nav_menu_object( $locations[ $location ] );
    if ( ! $menu || is_wp_error( $menu ) ) return array();
    $items = wp_get_nav_menu_items( $menu->term_id );
    if ( ! $items ) return array();
    return array_map( function( $item ) {
        return array(
            'ID'      => (int) $item->ID,
            // Parent menu-item id (0 for top level). React nests children under
            // their parent to build dropdown submenus.
            'parent'  => (int) $item->menu_item_parent,
            'title'   => $item->title,
            'url'     => $item->url,
            'target'  => $item->target,
            'classes' => implode( ' ', array_filter( (array) $item->classes ) ),
        );
    }, $items );
}

// ─── Design System: enqueue files that actually exist in ea_ds/ ───────────────
function ea_enqueue_ds() {
    $ds_uri = get_template_directory_uri() . '/ea_ds';
    $ds_dir = get_template_directory()     . '/ea_ds';
    $v      = '1.0.0';

    // CSS token files
    wp_enqueue_style( 'ea-fonts',      $ds_uri . '/tokens/fonts.css',      array(),                           $v );
    wp_enqueue_style( 'ea-colors',     $ds_uri . '/tokens/colors.css',     array('ea-fonts'),                 $v );
    wp_enqueue_style( 'ea-typography', $ds_uri . '/tokens/typography.css', array('ea-colors'),                $v );
    wp_enqueue_style( 'ea-spacing',    $ds_uri . '/tokens/spacing.css',    array('ea-colors'),                $v );
    wp_enqueue_style( 'ea-base',       $ds_uri . '/tokens/base.css',       array('ea-typography','ea-spacing'), $v );
    // NOTE: components/fig-tokens.css is referenced by the Figma export but was never
    // shipped in this DS bundle, and nothing uses its --fig* aliases. Enqueueing it only 404s.

    // React UMD (sets window.React and window.ReactDOM)
    wp_enqueue_script( 'react',     'https://unpkg.com/react@18.3.1/umd/react.production.min.js',         array(),        '18.3.1', true );
    wp_enqueue_script( 'react-dom', 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js', array('react'), '18.3.1', true );

    // EA Design System component bundle
    // Exposes: window.ElevationAthleticsDesignSystem_58666d.{NavBar, Button, Card, ...}
    $bundle_ver = file_exists( $ds_dir . '/_ds_bundle.js' )
        ? filemtime( $ds_dir . '/_ds_bundle.js' )
        : $v;
    wp_enqueue_script( 'ea-components', $ds_uri . '/_ds_bundle.js', array('react','react-dom'), $bundle_ver, true );
}
add_action( 'wp_enqueue_scripts', 'ea_enqueue_ds' );

// ─── Main React app (IIFE build — plain <script>, no type="module" needed) ────
function ea_react_enqueue_assets() {
    $main_js  = get_template_directory()     . '/assets/js/main.js';
    $main_uri = get_template_directory_uri() . '/assets/js/main.js';

    if ( ! file_exists( $main_js ) ) return;

    wp_enqueue_style(
        'ea-react-style',
        get_stylesheet_uri(),
        array('ea-base'),
        filemtime( get_stylesheet_directory() . '/style.css' )
    );

    // IIFE output: must load AFTER React + DS bundle (declared as dependencies)
    wp_enqueue_script(
        'ea-react-app',
        $main_uri,
        array('ea-components'),   // guarantees React + DS bundle load first
        filemtime( $main_js ),
        true                      // footer = true
    );

    wp_localize_script(
        'ea-react-app',
        'eaReactData',
        array(
            'siteUrl'  => get_site_url(),
            'themeUrl' => get_template_directory_uri(),
            'apiUrl'   => esc_url_raw( get_rest_url() ),
            // Nonce so logged-in requests to our REST routes are authenticated
            // (sent as the X-WP-Nonce header from the React app).
            'nonce'    => wp_create_nonce( 'wp_rest' ),
            'menus'    => array(
                'primary' => ea_react_get_menu_items( 'primary' ),
                'footer'  => ea_react_get_menu_items( 'footer' ),
            ),
            // Admin-swappable images (Appearance → Customize → EA Images).
            // Empty string = "not set", and React falls back to the bundled asset.
            'images'   => ea_react_images(),
        )
    );
}
add_action( 'wp_enqueue_scripts', 'ea_react_enqueue_assets' );

// NOTE: No script_loader_tag filter needed — IIFE is a plain script tag.

// ─── Swappable images via the Customizer (Appearance → Customize → EA Images) ──
// Each control stores an image URL as a theme_mod. ea_react_images() collects them
// for wp_localize_script so the React app can read them from window.eaReactData.images.
function ea_react_image_fields() {
    return array(
        'ea_img_logo'        => array( 'key' => 'logo',       'label' => 'Logo (replaces the wordmark in the nav)' ),
        'ea_img_hero'        => array( 'key' => 'hero',       'label' => 'Hero image (desktop)' ),
        'ea_img_hero_mobile' => array( 'key' => 'heroMobile', 'label' => 'Hero image (mobile)' ),
        'ea_img_spotlight_1' => array( 'key' => 'spotlight1', 'label' => 'Spotlight tile 1' ),
        'ea_img_spotlight_2' => array( 'key' => 'spotlight2', 'label' => 'Spotlight tile 2' ),
        'ea_img_spotlight_3' => array( 'key' => 'spotlight3', 'label' => 'Spotlight tile 3' ),
        'ea_img_ball' => array( 'key' => 'ball', 'label' => 'ball' ),
        'ea_img_net' => array( 'key' => 'net', 'label' => 'net' ),
        'ea_img_community_top' => array( 'key' => 'communityTop', 'label' => 'Community top image' ),
        'ea_img_community_left' => array( 'key' => 'communityLeft', 'label' => 'Community left image' ),
        'ea_img_community_right' => array( 'key' => 'communityRight', 'label' => 'Community right image' ),
    );
}

function ea_react_images() {
    $images = array();
    foreach ( ea_react_image_fields() as $setting => $meta ) {
        $images[ $meta['key'] ] = esc_url( get_theme_mod( $setting, '' ) );
    }
    return $images;
}

function ea_customize_images( $wp_customize ) {
    $wp_customize->add_section( 'ea_images', array(
        'title'       => __( 'EA Images', 'ea-react-theme' ),
        'description' => __( 'Upload images used across the site. Leave blank to use the theme defaults.', 'ea-react-theme' ),
        'priority'    => 30,
    ) );

    foreach ( ea_react_image_fields() as $setting => $meta ) {
        $wp_customize->add_setting( $setting, array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $setting, array(
            'label'    => $meta['label'],
            'section'  => 'ea_images',
            'settings' => $setting,
        ) ) );
    }
}
add_action( 'customize_register', 'ea_customize_images' );

// ─── Free Trial form submissions (custom REST endpoint) ───────────────────────
// The React Free Trial form POSTs here. We validate, then email the registration
// to the site admin via wp_mail(). Locally, the email is caught by Local's Mailpit
// (Site → Tools → Open Mailpit) — no real SMTP needed for testing.
function ea_register_free_trial_route() {
    register_rest_route( 'ea/v1', '/free-trial', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true', // public form; anyone can submit
        'callback'            => 'ea_handle_free_trial',
        'args'                => array(
            'name'    => array( 'required' => true,  'type' => 'string' ),
            'email'   => array( 'required' => true,  'type' => 'string' ),
            'session' => array( 'required' => false, 'type' => 'string' ),
            // Honeypot: real users leave this empty; bots tend to fill every field.
            'website' => array( 'required' => false, 'type' => 'string' ),
        ),
    ) );
}
add_action( 'rest_api_init', 'ea_register_free_trial_route' );

function ea_handle_free_trial( WP_REST_Request $request ) {
    // Spam honeypot — silently accept so bots don't retry, but send nothing.
    if ( ! empty( $request['website'] ) ) {
        return new WP_REST_Response( array( 'ok' => true ), 200 );
    }

    $name    = sanitize_text_field( wp_unslash( $request['name'] ) );
    $email   = sanitize_email( wp_unslash( $request['email'] ) );
    $session = sanitize_text_field( wp_unslash( $request['session'] ) );

    if ( '' === $name || '' === $email || ! is_email( $email ) ) {
        return new WP_Error(
            'ea_invalid',
            'Please provide a valid name and email.',
            array( 'status' => 422 )
        );
    }

    // 1) Store the submission as an ea_free_trial entry (viewable in wp-admin →
    //    Free Trials). This is the record of truth, so we do it first.
    $entry_id = wp_insert_post( array(
        'post_type'   => 'ea_free_trial',
        'post_status' => 'publish',
        'post_title'  => $name,
    ), true );

    if ( is_wp_error( $entry_id ) || ! $entry_id ) {
        return new WP_Error(
            'ea_store_failed',
            'Sorry, something went wrong saving your registration. Please try again.',
            array( 'status' => 500 )
        );
    }

    update_post_meta( $entry_id, '_ea_email', $email );
    update_post_meta( $entry_id, '_ea_session', $session );

    // 2) Email the admin as a notification (best-effort — the entry is already
    //    saved, so a mail hiccup must not fail the submission). Locally this is
    //    caught by Local's Mailpit (Site → Tools → Open Mailpit).
    $to      = get_option( 'admin_email' );
    $subject = 'New free trial registration';
    $body    = "A new free trial registration was submitted:\n\n"
             . "Athlete's Name: {$name}\n"
             . "Email: {$email}\n"
             . "Session: " . ( '' !== $session ? $session : '(not specified)' ) . "\n";
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        // Lets the admin hit "Reply" to respond to the registrant.
        'Reply-To: ' . $name . ' <' . $email . '>',
    );
    wp_mail( $to, $subject, $body, $headers );

    return new WP_REST_Response( array( 'ok' => true, 'id' => (int) $entry_id ), 200 );
}

// ─── "Free Trials" admin screen (stores + lists form submissions) ─────────────
// A private post type that only the form writes to. Admins view submissions under
// wp-admin → Free Trials; "Add New" is disabled since entries come from the form.
function ea_register_free_trial_cpt() {
    register_post_type( 'ea_free_trial', array(
        'labels' => array(
            'name'          => __( 'Free Trials', 'ea-react-theme' ),
            'singular_name' => __( 'Free Trial', 'ea-react-theme' ),
            'menu_name'     => __( 'Free Trials', 'ea-react-theme' ),
            'all_items'     => __( 'All Registrations', 'ea-react-theme' ),
            'search_items'  => __( 'Search Registrations', 'ea-react-theme' ),
        ),
        'public'              => false,   // not a front-end URL
        'show_ui'             => true,    // but visible in wp-admin
        'show_in_menu'        => true,
        'menu_icon'           => 'dashicons-clipboard',
        'menu_position'       => 26,
        'supports'            => array( 'title' ),
        'capability_type'     => 'post',
        'map_meta_cap'        => true,
        // No manual creation — registrations only arrive via the form endpoint.
        'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
        'exclude_from_search' => true,
    ) );
}
add_action( 'init', 'ea_register_free_trial_cpt' );

// Columns for the Free Trials list table: Name | Email | Session | Submitted.
function ea_free_trial_columns( $columns ) {
    return array(
        'cb'         => isset( $columns['cb'] ) ? $columns['cb'] : '',
        'title'      => __( 'Athlete', 'ea-react-theme' ),
        'ea_email'   => __( 'Email', 'ea-react-theme' ),
        'ea_session' => __( 'Session', 'ea-react-theme' ),
        'date'       => __( 'Submitted', 'ea-react-theme' ),
    );
}
add_filter( 'manage_ea_free_trial_posts_columns', 'ea_free_trial_columns' );

function ea_free_trial_column_content( $column, $post_id ) {
    if ( 'ea_email' === $column ) {
        $email = get_post_meta( $post_id, '_ea_email', true );
        echo $email ? '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>' : '—';
    } elseif ( 'ea_session' === $column ) {
        $session = get_post_meta( $post_id, '_ea_session', true );
        echo $session ? esc_html( $session ) : '—';
    }
}
add_action( 'manage_ea_free_trial_posts_custom_column', 'ea_free_trial_column_content', 10, 2 );
