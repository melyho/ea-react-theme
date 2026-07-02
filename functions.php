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
        'primary'            => __( 'Primary Menu', 'ea-react-theme' ),
        'footer_quick_links' => __( 'Footer: Quick Links', 'ea-react-theme' ),
        'footer_more_sports' => __( 'Footer: More Sports', 'ea-react-theme' ),
        'footer_contact'     => __( 'Footer: Contact', 'ea-react-theme' ),
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

// ─── Preload the display webfont so headings render without the swap flash ────
// BBH Bogle is used for every headline; preloading the WOFF2 lets the browser
// fetch it in parallel with CSS instead of waiting until fonts.css is parsed.
// Note: crossorigin is required on font preloads even for same-origin requests,
// otherwise the browser fetches the font twice.
function ea_preload_fonts() {
    $font_uri = get_template_directory_uri() . '/ea_ds/assets/fonts/BBHBogle-Regular.woff2';
    printf(
        '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
        esc_url( $font_uri )
    );
}
add_action( 'wp_head', 'ea_preload_fonts', 1 );

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
                'primary'          => ea_react_get_menu_items( 'primary' ),
                'footerQuickLinks' => ea_react_get_menu_items( 'footer_quick_links' ),
                'footerMoreSports' => ea_react_get_menu_items( 'footer_more_sports' ),
                'footerContact'    => ea_react_get_menu_items( 'footer_contact' ),
            ),
            // Admin-swappable images (Appearance → Customize → EA Images).
            // Empty string = "not set", and React falls back to the bundled asset.
            'images'   => ea_react_images(),
            // Admin-editable marketing copy (Appearance → Customize → EA Text).
            'texts'    => ea_react_texts(),
            // Layout toggles (Appearance → Customize → EA Options).
            'options'  => ea_react_options(),
            // Social profile links (Appearance → Customize → EA Social Links).
            'social'   => ea_react_social(),
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
        'ea_img_carousel_1'  => array( 'key' => 'carousel1',  'label' => 'Carousel image 1' ),
        'ea_img_carousel_2'  => array( 'key' => 'carousel2',  'label' => 'Carousel image 2' ),
        'ea_img_carousel_3'  => array( 'key' => 'carousel3',  'label' => 'Carousel image 3' ),
        'ea_img_section'          => array( 'key' => 'sectionImage',         'label' => 'Free Trial / Carousel image' ),
        'ea_img_section_mobile'   => array( 'key' => 'sectionImageMobile',   'label' => 'Free Trial / Carousel image (mobile)' ),
        'ea_img_newsletter'       => array( 'key' => 'newsletter',           'label' => 'Newsletter image' ),
        'ea_img_newsletter_mobile'=> array( 'key' => 'newsletterMobile',     'label' => 'Newsletter image (mobile)' ),
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

// ─── Swappable copy via the Customizer (Appearance → Customize → EA Text) ──────
// Each control stores a string as a theme_mod. ea_react_texts() collects them for
// wp_localize_script so React reads them from window.eaReactData.texts. Each field
// ships with its current copy as the default; clearing a field restores that copy
// (React keeps the same string as a final fallback).
function ea_react_text_fields() {
    return array(
        // ── Hero ──────────────────────────────────────────────────────────────
        'ea_txt_hero_heading' => array(
            'key' => 'heroHeading', 'label' => 'Hero — Heading', 'type' => 'text',
            'default' => 'Play pickleball in Ontario',
        ),
        'ea_txt_hero_desc' => array(
            'key' => 'heroDesc', 'label' => 'Hero — Subtext', 'type' => 'textarea',
            'default' => 'Join Canada’s most exciting and fastest-growing pickleball community! We welcome players of all skill levels onto the court.',
        ),
        'ea_txt_hero_btn_primary' => array(
            'key' => 'heroBtnPrimary', 'label' => 'Hero — Primary button', 'type' => 'text',
            'default' => 'Find a League Near You',
        ),
        'ea_txt_hero_btn_secondary' => array(
            'key' => 'heroBtnSecondary', 'label' => 'Hero — Secondary button', 'type' => 'text',
            'default' => 'New to Pickleball? Start Here',
        ),

        // ── Navigation ────────────────────────────────────────────────────────
        'ea_txt_nav_cta' => array(
            'key' => 'navCta', 'label' => 'Navigation — CTA button', 'type' => 'text',
            'default' => 'Find a League Near You',
        ),
        'ea_txt_nav_connect' => array(
            'key' => 'navConnect', 'label' => 'Navigation — Connect link', 'type' => 'text',
            'default' => 'Connect with us',
        ),

        // ── New Programs / Carousel ───────────────────────────────────────────
        'ea_txt_new_programs_heading' => array(
            'key' => 'newProgramsHeading', 'label' => 'New Programs — Heading', 'type' => 'text',
            'default' => 'Check out our new programs!',
        ),

        // ── Free Trial form ───────────────────────────────────────────────────
        'ea_txt_free_trial_heading' => array(
            'key' => 'freeTrialHeading', 'label' => 'Free Trial — Heading', 'type' => 'text',
            'default' => 'Register for your free trial!',
        ),
        'ea_txt_free_trial_name_label' => array(
            'key' => 'freeTrialNameLabel', 'label' => 'Free Trial — Name field label', 'type' => 'text',
            'default' => 'Athlete\'s Name',
        ),
        'ea_txt_free_trial_email_label' => array(
            'key' => 'freeTrialEmailLabel', 'label' => 'Free Trial — Email field label', 'type' => 'text',
            'default' => 'Email',
        ),
        'ea_txt_free_trial_session_label' => array(
            'key' => 'freeTrialSessionLabel', 'label' => 'Free Trial — Session field label', 'type' => 'text',
            'default' => 'Choose Session',
        ),
        'ea_txt_free_trial_sessions' => array(
            'key' => 'freeTrialSessions', 'label' => 'Free Trial — Session options (one per line)', 'type' => 'textarea',
            'default' => "Ontario\nBritish Columbia\nAlberta",
        ),
        'ea_txt_free_trial_submit' => array(
            'key' => 'freeTrialSubmit', 'label' => 'Free Trial — Submit button', 'type' => 'text',
            'default' => 'Register',
        ),
        'ea_txt_free_trial_thanks_title' => array(
            'key' => 'freeTrialThanksTitle', 'label' => 'Free Trial — Confirmation title', 'type' => 'text',
            'default' => 'Thank you!',
        ),
        'ea_txt_free_trial_thanks_body' => array(
            'key' => 'freeTrialThanksBody', 'label' => 'Free Trial — Confirmation message', 'type' => 'textarea',
            'default' => 'We\'ll be in touch about your free trial.',
        ),

        // ── Active Programs ───────────────────────────────────────────────────
        'ea_txt_programs_heading' => array(
            'key' => 'programsHeading', 'label' => 'Active Programs — Heading', 'type' => 'text',
            'default' => 'Our Active Programs',
        ),
        'ea_txt_programs_desc' => array(
            'key' => 'programsDesc', 'label' => 'Active Programs — Description', 'type' => 'textarea',
            'default' => 'We run pickleball programs across the country. Click on any location card below to visit its program page and see all the lessons and leagues available in that area.',
        ),
        'ea_txt_programs_view_all' => array(
            'key' => 'programsViewAll', 'label' => 'Active Programs — "View all" button', 'type' => 'text',
            'default' => 'View All Locations',
        ),
        'ea_txt_programs_near_me' => array(
            'key' => 'programsNearMe', 'label' => 'Active Programs — "Near me" button', 'type' => 'text',
            'default' => 'Locations Near Me',
        ),

        // ── Small Group Coaching ──────────────────────────────────────────────
        'ea_txt_coaching_heading' => array(
            'key' => 'coachingHeading', 'label' => 'Coaching — Heading', 'type' => 'text',
            'default' => 'Small Group Coaching',
        ),
        'ea_txt_coaching_desc' => array(
            'key' => 'coachingDesc', 'label' => 'Coaching — Description', 'type' => 'textarea',
            'default' => 'Small group coaching that meets every player where they are. Our sessions build skills, confidence, and a love of the game.',
        ),
        'ea_txt_coaching_cta' => array(
            'key' => 'coachingCta', 'label' => 'Coaching — Button', 'type' => 'text',
            'default' => 'Learn More',
        ),

        // ── Community ─────────────────────────────────────────────────────────
        'ea_txt_community_heading' => array(
            'key' => 'communityHeading', 'label' => 'Community — Heading', 'type' => 'text',
            'default' => 'Want to be a part of the community?',
        ),
        'ea_txt_community_desc_1' => array(
            'key' => 'communityDesc1', 'label' => 'Community — Paragraph 1', 'type' => 'textarea',
            'default' => 'From first-timers to future champions, Elevation Athletics badminton is built around fun, inclusive play for every family.',
        ),
        'ea_txt_community_desc_2' => array(
            'key' => 'communityDesc2', 'label' => 'Community — Paragraph 2', 'type' => 'textarea',
            'default' => 'Join a welcoming community of players, parents, and coaches who make every session something to look forward to.',
        ),
        'ea_txt_partnerships_title' => array(
            'key' => 'partnershipsTitle', 'label' => 'Community — Partnerships title', 'type' => 'text',
            'default' => 'Community Partnerships',
        ),
        'ea_txt_partnerships_blurb' => array(
            'key' => 'partnershipsBlurb', 'label' => 'Community — Partnerships blurb', 'type' => 'textarea',
            'default' => 'Help bring inclusive, low-cost badminton to your township. We\'ll set you up with courts, coaching, and leagues.',
        ),
        'ea_txt_partnerships_cta' => array(
            'key' => 'partnershipsCta', 'label' => 'Community — Partnerships button', 'type' => 'text',
            'default' => 'Learn More',
        ),
        'ea_txt_leaders_title' => array(
            'key' => 'leadersTitle', 'label' => 'Community — Leaders title', 'type' => 'text',
            'default' => 'Become a Community Leader',
        ),
        'ea_txt_leaders_blurb' => array(
            'key' => 'leadersBlurb', 'label' => 'Community — Leaders blurb', 'type' => 'textarea',
            'default' => 'Help bring inclusive, low-cost badminton to your township. We\'ll set you up with courts, coaching, and leagues.',
        ),
        'ea_txt_leaders_cta' => array(
            'key' => 'leadersCta', 'label' => 'Community — Leaders button', 'type' => 'text',
            'default' => 'Apply Today',
        ),

        // ── Newsletter ────────────────────────────────────────────────────────
        'ea_txt_newsletter_heading' => array(
            'key' => 'newsletterHeading', 'label' => 'Newsletter — Heading', 'type' => 'text',
            'default' => 'Join Our Newsletter!',
        ),
        'ea_txt_newsletter_desc' => array(
            'key' => 'newsletterDesc', 'label' => 'Newsletter — Description', 'type' => 'textarea',
            'default' => 'Stay updated on upcoming training sessions, leagues, and tournaments for pickleball in your area.',
        ),
        'ea_txt_newsletter_subscribe' => array(
            'key' => 'newsletterSubscribe', 'label' => 'Newsletter — Subscribe button', 'type' => 'text',
            'default' => 'Subscribe',
        ),
        'ea_txt_newsletter_thanks' => array(
            'key' => 'newsletterThanks', 'label' => 'Newsletter — Confirmation', 'type' => 'text',
            'default' => 'Thanks for subscribing!',
        ),

        // ── Footer ────────────────────────────────────────────────────────────
        'ea_txt_footer_contact_heading' => array(
            'key' => 'footerContactHeading', 'label' => 'Footer — Contact heading', 'type' => 'text',
            'default' => 'Contact Us',
        ),
        'ea_txt_footer_socials_heading' => array(
            'key' => 'footerSocialsHeading', 'label' => 'Footer — Socials heading', 'type' => 'text',
            'default' => 'Follow us on our socials!',
        ),
        'ea_txt_footer_quicklinks_title' => array(
            'key' => 'footerQuickLinksTitle', 'label' => 'Footer — Quick Links title', 'type' => 'text',
            'default' => 'Quick Links',
        ),
        'ea_txt_footer_moresports_title' => array(
            'key' => 'footerMoreSportsTitle', 'label' => 'Footer — More Sports title', 'type' => 'text',
            'default' => 'More Sports',
        ),
        'ea_txt_footer_copyright' => array(
            'key' => 'footerCopyright', 'label' => 'Footer — Copyright (year is added automatically)', 'type' => 'text',
            'default' => 'Elevation Athletics. All rights reserved.',
        ),
    );
}

function ea_react_texts() {
    $texts = array();
    foreach ( ea_react_text_fields() as $setting => $meta ) {
        $texts[ $meta['key'] ] = get_theme_mod( $setting, $meta['default'] );
    }
    return $texts;
}

// ─── Layout toggles via the Customizer (Appearance → Customize → EA Options) ───
// Sports that can appear in the Active Programs feed. Keys match the codes used in
// the programs JSON (React maps common variants onto these).
function ea_sport_choices() {
    return array(
        'pb'     => __( 'Pickleball', 'ea-react-theme' ),
        'bad'    => __( 'Badminton', 'ea-react-theme' ),
        'bask'   => __( 'Basketball', 'ea-react-theme' ),
        's_camp' => __( 'Sports Camp', 'ea-react-theme' ),
    );
}

// Keep only recognised sport keys; always return a (possibly empty) array.
function ea_sanitize_sports( $value ) {
    $allowed = array_keys( ea_sport_choices() );
    $value   = is_array( $value ) ? $value : ( '' === $value || null === $value ? array() : (array) $value );
    return array_values( array_intersect( array_map( 'strval', $value ), $allowed ) );
}

function ea_react_options() {
    return array(
        // true = photo carousel, false = the Free Trial registration form.
        'useCarousel' => (bool) get_theme_mod( 'ea_use_carousel', true ),
        // Sports shown in the Active Programs section (defaults to Badminton).
        'sports'      => ea_sanitize_sports( get_theme_mod( 'ea_sports', array( 'bad' ) ) ),
    );
}

// Define a simple <select multiple> control (WP core has no native multi-select).
// Runs before the controls are added (priority 9 < default 10).
function ea_define_customize_controls() {
    if ( class_exists( 'EA_Multi_Select_Control' ) || ! class_exists( 'WP_Customize_Control' ) ) {
        return;
    }
    class EA_Multi_Select_Control extends WP_Customize_Control {
        public $type = 'ea_multiselect';
        public function render_content() {
            if ( empty( $this->choices ) ) {
                return;
            }
            $selected = $this->value();
            $selected = is_array( $selected ) ? array_map( 'strval', $selected ) : array();
            ?>
            <label>
                <?php if ( ! empty( $this->label ) ) : ?>
                    <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
                <?php endif; ?>
                <?php if ( ! empty( $this->description ) ) : ?>
                    <span class="description customize-control-description"><?php echo wp_kses_post( $this->description ); ?></span>
                <?php endif; ?>
                <select multiple="multiple" style="height:auto;min-height:96px;width:100%;" <?php $this->link(); ?>>
                    <?php foreach ( $this->choices as $val => $label ) : ?>
                        <option value="<?php echo esc_attr( $val ); ?>" <?php selected( in_array( (string) $val, $selected, true ) ); ?>>
                            <?php echo esc_html( $label ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </label>
            <?php
        }
    }
}
add_action( 'customize_register', 'ea_define_customize_controls', 9 );

// ─── Social profile links via the Customizer (Appearance → Customize → EA Social) ─
// Plain URL fields — no WP menu required. Blank fields hide that icon in the footer.
function ea_react_social_fields() {
    return array(
        'ea_social_instagram' => array(
            'key' => 'instagram', 'label' => 'Instagram URL',
            'default' => 'https://www.instagram.com/elevationathleticsbadminton/',
        ),
        'ea_social_facebook' => array(
            'key' => 'facebook', 'label' => 'Facebook URL',
            'default' => 'https://www.facebook.com/profile.php?id=61573558378113',
        ),
    );
}

function ea_react_social() {
    $social = array();
    foreach ( ea_react_social_fields() as $setting => $meta ) {
        $social[ $meta['key'] ] = esc_url( get_theme_mod( $setting, $meta['default'] ) );
    }
    return $social;
}

function ea_customize_social( $wp_customize ) {
    $wp_customize->add_section( 'ea_social', array(
        'title'       => __( 'EA Social Links', 'ea-react-theme' ),
        'description' => __( 'Links for the footer social icons. Clear a field to hide that icon.', 'ea-react-theme' ),
        'priority'    => 33,
    ) );
    foreach ( ea_react_social_fields() as $setting => $meta ) {
        $wp_customize->add_setting( $setting, array(
            'default'           => $meta['default'],
            'sanitize_callback' => 'esc_url_raw',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( $setting, array(
            'type'    => 'url',
            'label'   => $meta['label'],
            'section' => 'ea_social',
        ) );
    }
}
add_action( 'customize_register', 'ea_customize_social' );

function ea_customize_options( $wp_customize ) {
    $wp_customize->add_section( 'ea_options', array(
        'title'    => __( 'EA Options', 'ea-react-theme' ),
        'priority' => 32,
    ) );
    $wp_customize->add_setting( 'ea_use_carousel', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport'         => 'refresh',
    ) );
    $wp_customize->add_control( 'ea_use_carousel', array(
        'type'        => 'checkbox',
        'label'       => __( 'Show photo carousel', 'ea-react-theme' ),
        'description' => __( 'Uncheck to show the Free Trial registration form instead.', 'ea-react-theme' ),
        'section'     => 'ea_options',
    ) );

    $wp_customize->add_setting( 'ea_sports', array(
        'default'           => array( 'bad' ),
        'sanitize_callback' => 'ea_sanitize_sports',
        'transport'         => 'refresh',
    ) );
    $wp_customize->add_control( new EA_Multi_Select_Control( $wp_customize, 'ea_sports', array(
        'label'       => __( 'Active Programs sports', 'ea-react-theme' ),
        'description' => __( 'Select which sports appear in the Active Programs section. Hold Ctrl (Windows) or Cmd (Mac) to pick more than one.', 'ea-react-theme' ),
        'section'     => 'ea_options',
        'choices'     => ea_sport_choices(),
    ) ) );
}
add_action( 'customize_register', 'ea_customize_options' );

function ea_customize_texts( $wp_customize ) {
    $wp_customize->add_section( 'ea_text', array(
        'title'       => __( 'EA Text', 'ea-react-theme' ),
        'description' => __( 'Edit the marketing copy shown across the home page. Clear a field to restore its default.', 'ea-react-theme' ),
        'priority'    => 31,
    ) );

    foreach ( ea_react_text_fields() as $setting => $meta ) {
        $sanitize = ( 'textarea' === $meta['type'] ) ? 'sanitize_textarea_field' : 'sanitize_text_field';
        $wp_customize->add_setting( $setting, array(
            'default'           => $meta['default'],
            'sanitize_callback' => $sanitize,
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( $setting, array(
            'type'     => $meta['type'],
            'label'    => $meta['label'],
            'section'  => 'ea_text',
            'settings' => $setting,
        ) );
    }
}
add_action( 'customize_register', 'ea_customize_texts' );

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

// ─── Newsletter signups (custom REST endpoint) ────────────────────────────────
// The React newsletter form POSTs here. We validate the email, store it as an
// ea_newsletter entry, then notify the admin. Mirrors the Free Trial flow above.
function ea_register_newsletter_route() {
    register_rest_route( 'ea/v1', '/newsletter', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true', // public form; anyone can submit
        'callback'            => 'ea_handle_newsletter',
        'args'                => array(
            'email'    => array( 'required' => true,  'type' => 'string' ),
            // Which location card the signup came from (optional; blank = general signup).
            'location' => array( 'required' => false, 'type' => 'string' ),
            // Honeypot: real users leave this empty; bots tend to fill every field.
            'website'  => array( 'required' => false, 'type' => 'string' ),
        ),
    ) );
}
add_action( 'rest_api_init', 'ea_register_newsletter_route' );

function ea_handle_newsletter( WP_REST_Request $request ) {
    // Spam honeypot — silently accept so bots don't retry, but send nothing.
    if ( ! empty( $request['website'] ) ) {
        return new WP_REST_Response( array( 'ok' => true ), 200 );
    }

    $email    = sanitize_email( wp_unslash( $request['email'] ) );
    $location = isset( $request['location'] ) ? sanitize_text_field( wp_unslash( $request['location'] ) ) : '';

    if ( '' === $email || ! is_email( $email ) ) {
        return new WP_Error(
            'ea_invalid',
            'Please provide a valid email address.',
            array( 'status' => 422 )
        );
    }

    // One record per email. Reuse the existing entry if this address already signed
    // up so we can accumulate the locations they've subscribed to.
    $existing = get_posts( array(
        'post_type'   => 'ea_newsletter',
        'post_status' => 'publish',
        'title'       => $email,
        'numberposts' => 1,
        'fields'      => 'ids',
    ) );

    if ( ! empty( $existing ) ) {
        $entry_id = (int) $existing[0];
    } else {
        // Record of truth first (viewable in wp-admin → Newsletter).
        $entry_id = wp_insert_post( array(
            'post_type'   => 'ea_newsletter',
            'post_status' => 'publish',
            'post_title'  => $email,
        ), true );

        if ( is_wp_error( $entry_id ) || ! $entry_id ) {
            return new WP_Error(
                'ea_store_failed',
                'Sorry, something went wrong saving your subscription. Please try again.',
                array( 'status' => 500 )
            );
        }
        update_post_meta( $entry_id, '_ea_email', $email );
    }

    // Track which locations this email is signed up for (present = subscribed / true).
    if ( '' !== $location ) {
        $locations = get_post_meta( $entry_id, '_ea_locations', true );
        if ( ! is_array( $locations ) ) {
            $locations = array();
        }
        if ( ! in_array( $location, $locations, true ) ) {
            $locations[] = $location;
            update_post_meta( $entry_id, '_ea_locations', $locations );
        }
    }

    // Notify the admin (best-effort — the entry is already saved). Locally this is
    // caught by Local's Mailpit (Site → Tools → Open Mailpit).
    $to      = get_option( 'admin_email' );
    $subject = 'New newsletter signup';
    $body    = "A newsletter signup was submitted:\n\nEmail: {$email}\n"
             . 'Location: ' . ( '' !== $location ? $location : '(general)' ) . "\n";
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $email,
    );
    wp_mail( $to, $subject, $body, $headers );

    return new WP_REST_Response( array( 'ok' => true, 'id' => (int) $entry_id ), 200 );
}

// ─── "Newsletter" admin screen (stores + lists signups) ───────────────────────
function ea_register_newsletter_cpt() {
    register_post_type( 'ea_newsletter', array(
        'labels' => array(
            'name'          => __( 'Newsletter', 'ea-react-theme' ),
            'singular_name' => __( 'Subscriber', 'ea-react-theme' ),
            'menu_name'     => __( 'Newsletter', 'ea-react-theme' ),
            'all_items'     => __( 'All Subscribers', 'ea-react-theme' ),
            'search_items'  => __( 'Search Subscribers', 'ea-react-theme' ),
        ),
        'public'              => false,   // not a front-end URL
        'show_ui'             => true,    // but visible in wp-admin
        'show_in_menu'        => true,
        'menu_icon'           => 'dashicons-email',
        'menu_position'       => 27,
        'supports'            => array( 'title' ),
        'capability_type'     => 'post',
        'map_meta_cap'        => true,
        // No manual creation — signups only arrive via the form endpoint.
        'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
        'exclude_from_search' => true,
    ) );
}
add_action( 'init', 'ea_register_newsletter_cpt' );

// Columns for the Newsletter list table: Email | Locations | Subscribed.
function ea_newsletter_columns( $columns ) {
    return array(
        'cb'           => isset( $columns['cb'] ) ? $columns['cb'] : '',
        'title'        => __( 'Email', 'ea-react-theme' ),
        'ea_locations' => __( 'Locations', 'ea-react-theme' ),
        'date'         => __( 'Subscribed', 'ea-react-theme' ),
    );
}
add_filter( 'manage_ea_newsletter_posts_columns', 'ea_newsletter_columns' );

function ea_newsletter_column_content( $column, $post_id ) {
    if ( 'ea_locations' === $column ) {
        $locations = get_post_meta( $post_id, '_ea_locations', true );
        echo ( is_array( $locations ) && $locations )
            ? esc_html( implode( ', ', $locations ) )
            : '<span aria-hidden="true">—</span>';
    }
}
add_action( 'manage_ea_newsletter_posts_custom_column', 'ea_newsletter_column_content', 10, 2 );
