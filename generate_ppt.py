import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette (BrewBox Artisanal Roastery Theme)
BG_DARK = RGBColor(14, 11, 10)         # #0E0B0A - Deep Smoked Roastery Black
CARD_BG = RGBColor(25, 20, 18)         # #191412 - Dark Roastery Slate
CARD_BG_ALT = RGBColor(32, 25, 22)     # #201916 - Slightly lighter card
CARD_BORDER = RGBColor(50, 40, 35)     # #322823 - Subtle Warm Border
CARD_BORDER_ACCENT = RGBColor(180, 95, 45) # Warm Amber Border
ACCENT_AMBER = RGBColor(226, 122, 63)  # #E27A3F - Vibrant Terracotta Amber
ACCENT_LIGHT = RGBColor(242, 166, 121) # #F2A679 - Light Amber
ACCENT_SAGE = RGBColor(82, 183, 136)   # #52B788 - Botanical Matcha Sage
ACCENT_GOLD = RGBColor(229, 168, 85)   # #E5A855 - Crema / Honey
TEXT_WHITE = RGBColor(249, 246, 240)   # #F9F6F0 - Warm Oat Milk White
TEXT_MUTED = RGBColor(168, 159, 149)   # #A89F95 - Parchment Muted Gray
TEXT_FAINT = RGBColor(115, 107, 99)    # #736B63 - Faint Divider Gray

FONT_HEADING = "Helvetica"
FONT_BODY = "Arial"

blank_layout = prs.slide_layouts[6]

SCREENSHOT_DIR = "/home/varad/projects/BrewBox/docs/screenshots"
IMG_HOME = os.path.join(SCREENSHOT_DIR, "screen_home.png")
IMG_EXPLORE = os.path.join(SCREENSHOT_DIR, "screen_explore.png")
IMG_DETAILS = os.path.join(SCREENSHOT_DIR, "screen_details.png")
IMG_CART = os.path.join(SCREENSHOT_DIR, "screen_cart.png")
IMG_QUIZ = os.path.join(SCREENSHOT_DIR, "screen_quiz.png")
IMG_PALATE = os.path.join(SCREENSHOT_DIR, "screen_palate.png")

def set_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()
    return bg

def add_header(slide, category_text, title_text, subtitle_text=None):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.733), Inches(1.2))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    # Eyebrow
    p_eye = tf.paragraphs[0]
    p_eye.text = category_text.upper()
    p_eye.font.name = FONT_HEADING
    p_eye.font.size = Pt(11)
    p_eye.font.bold = True
    p_eye.font.color.rgb = ACCENT_AMBER
    p_eye.space_after = Pt(3)
    
    # Title
    p_title = tf.add_paragraph()
    p_title.text = title_text
    p_title.font.name = FONT_HEADING
    p_title.font.size = Pt(28)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE
    
    if subtitle_text:
        p_title.space_after = Pt(3)
        p_sub = tf.add_paragraph()
        p_sub.text = subtitle_text
        p_sub.font.name = FONT_BODY
        p_sub.font.size = Pt(12.5)
        p_sub.font.color.rgb = TEXT_MUTED

def add_footer(slide, slide_num, total_slides=12):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.92), Inches(10.0), Inches(0.35))
    tf = tb.text_frame
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = "CPAD · BrewBox Mobile App · Varad Vikas Mandhare"
    p.font.name = FONT_BODY
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_FAINT
    
    tb_r = slide.shapes.add_textbox(Inches(10.5), Inches(6.92), Inches(2.033), Inches(0.35))
    tf_r = tb_r.text_frame
    tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    p_r.text = f"{slide_num:02d} / {total_slides:02d}"
    p_r.font.name = FONT_BODY
    p_r.font.size = Pt(9.5)
    p_r.font.color.rgb = TEXT_FAINT

def create_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
    else:
        card.line.fill.background()
    return card

def add_phone_mockup(slide, img_path, left, top, width, height):
    bezel_pad = Inches(0.06)
    bezel = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        left - bezel_pad,
        top - bezel_pad,
        width + (bezel_pad * 2),
        height + (bezel_pad * 2)
    )
    bezel.fill.solid()
    bezel.fill.fore_color.rgb = RGBColor(28, 22, 19)
    bezel.line.color.rgb = RGBColor(65, 52, 45)
    bezel.line.width = Pt(1.5)
    
    if os.path.exists(img_path):
        slide.shapes.add_picture(img_path, left, top, width, height)

# ==============================================================================
# SLIDE 01: COVER (CPAD & REACT NATIVE FOCUSED)
# ==============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1)

tb1 = s1.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(7.8), Inches(4.8))
tf1 = tb1.text_frame
tf1.word_wrap = True
tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0

p = tf1.paragraphs[0]
p.text = "● CROSS PLATFORM APP DEVELOPMENT (CPAD) · JURY 1"
p.font.name = FONT_HEADING
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = ACCENT_SAGE
p.space_after = Pt(14)

p = tf1.add_paragraph()
p.text = "BrewBox"
p.font.name = FONT_HEADING
p.font.size = Pt(56)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(10)

p = tf1.add_paragraph()
p.text = "Specialty Coffee & Fine Tea Roastery\nCross-Platform Mobile Application in React Native"
p.font.name = FONT_BODY
p.font.size = Pt(19)
p.font.color.rgb = ACCENT_LIGHT
p.space_after = Pt(26)

p = tf1.add_paragraph()
p.text = "Varad Vikas Mandhare"
p.font.name = FONT_HEADING
p.font.size = Pt(18)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(4)

p = tf1.add_paragraph()
p.text = "B.Tech Information Technology · MIT ADT University, Pune"
p.font.name = FONT_BODY
p.font.size = Pt(13.5)
p.font.color.rgb = TEXT_MUTED
p.space_after = Pt(14)

p = tf1.add_paragraph()
p.text = "React Native 0.87.0  ·  TypeScript 6.0  ·  Zustand 5.0  ·  Hermes Engine  ·  Android SDK"
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = ACCENT_AMBER

add_phone_mockup(s1, IMG_HOME, Inches(9.2), Inches(0.9), Inches(2.6), Inches(5.78))

# ==============================================================================
# SLIDE 02: MOTIVATION & CROSS-PLATFORM PARADIGM
# ==============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, "02 — MOTIVATION & CPAD PARADIGM", "Why React Native for BrewBox?", "Evaluating mobile architecture trade-offs for high-performance cross-platform commerce.")
add_footer(s2, 2)

col_width = Inches(3.64)
col_gap = Inches(0.4)
top_pos = Inches(1.9)
card_h = Inches(4.0)

# Card 1: Native Silos
create_card(s2, Inches(0.8), top_pos, col_width, card_h)
tb = s2.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(3.14), Inches(3.5))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

p = tf.paragraphs[0]
p.text = "01"
p.font.name = FONT_HEADING
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf.add_paragraph()
p.text = "Native Silos (Kotlin / Swift)"
p.font.name = FONT_HEADING
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(12)

p = tf.add_paragraph()
p.text = "Maintaining two distinct native codebases requires duplicated business logic, divergent cart mathematics, and fragmented feature rollouts.\n\nHigh engineering overhead for specialty single-origin stores where consistency across Android and iOS is critical."
p.font.name = FONT_BODY
p.font.size = Pt(11.5)
p.font.color.rgb = TEXT_MUTED

# Card 2: Hybrid WebViews
create_card(s2, Inches(0.8) + col_width + col_gap, top_pos, col_width, card_h)
tb = s2.shapes.add_textbox(Inches(1.05) + col_width + col_gap, Inches(2.15), Inches(3.14), Inches(3.5))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

p = tf.paragraphs[0]
p.text = "02"
p.font.name = FONT_HEADING
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf.add_paragraph()
p.text = "Hybrid WebViews (Cordova/PWA)"
p.font.name = FONT_HEADING
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(12)

p = tf.add_paragraph()
p.text = "Web-based wrappers suffer from DOM bridge latency, stuttering scroll views, lack of 60fps tactile feedback, and fragile offline behavior.\n\nIncapable of delivering the rich, sensory roastery experience (5-stage RoastMeters, extraction timers) required."
p.font.name = FONT_BODY
p.font.size = Pt(11.5)
p.font.color.rgb = TEXT_MUTED

# Card 3: React Native (BrewBox)
create_card(s2, Inches(0.8) + (col_width + col_gap) * 2, top_pos, col_width, card_h, CARD_BG_ALT, CARD_BORDER_ACCENT)
tb = s2.shapes.add_textbox(Inches(1.05) + (col_width + col_gap) * 2, Inches(2.15), Inches(3.14), Inches(3.5))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

p = tf.paragraphs[0]
p.text = "03"
p.font.name = FONT_HEADING
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf.add_paragraph()
p.text = "React Native (BrewBox)"
p.font.name = FONT_HEADING
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(12)

p = tf.add_paragraph()
p.text = "Single declarative TypeScript codebase compiled to real native Android/iOS view hierarchies via the Yoga Flexbox engine.\n\nHermes AOT bytecode execution, zero DOM overhead, unidirectional Zustand state, and 100% standalone offline APK capability."
p.font.name = FONT_BODY
p.font.size = Pt(11.5)
p.font.color.rgb = TEXT_MUTED

pill = create_card(s2, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.55), CARD_BG, CARD_BORDER)
tb_pill = s2.shapes.add_textbox(Inches(1.1), Inches(6.25), Inches(11.133), Inches(0.35))
tf_p = tb_pill.text_frame
tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0
p = tf_p.paragraphs[0]
p.text = "● CPAD Core Principle: Shared declarative TypeScript logic paired with native platform UI rendering for 60fps performance."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = ACCENT_SAGE

# ==============================================================================
# SLIDE 03: CPAD OBJECTIVES & REACT NATIVE GOALS
# ==============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, "03 — COURSE OBJECTIVES & GOALS", "Six engineering goals in React Native.")
add_footer(s3, 3)

obj_width = Inches(3.64)
obj_height = Inches(1.95)
x_coords = [Inches(0.8), Inches(0.8) + Inches(4.04), Inches(0.8) + Inches(8.08)]
y_coords = [Inches(2.0), Inches(4.25)]

objectives_data = [
    ("01", "Cross-Platform Architecture", "Single declarative TypeScript codebase running natively on Android with zero code duplication or platform silos."),
    ("02", "Custom Component Design", "Handcrafted artisanal UI widgets without heavy third-party UI kits (RoastMeter, TasteProfileBar, GrindSelector)."),
    ("03", "Declarative State Management", "Lightweight unidirectional state using Zustand 5.0, eliminating prop-drilling and optimizing render performance."),
    ("04", "Multi-Screen Navigation", "Deeply nested routing architecture combining React Navigation Native Stack and custom 5-tab Bottom Tab Bar."),
    ("05", "Vector Graphics Pipeline", "Zero-dependency vector rendering using react-native-svg, ensuring scalable high-DPI rendering across devices."),
    ("06", "Native Build & Offline APK", "Complete React Native CLI workflow, embedded JS bundling, and zero-Metro standalone offline execution on hardware.")
]

for idx, (num, title, desc) in enumerate(objectives_data):
    row = idx // 3
    col = idx % 3
    create_card(s3, x_coords[col], y_coords[row], obj_width, obj_height)
    
    tb = s3.shapes.add_textbox(x_coords[col] + Inches(0.25), y_coords[row] + Inches(0.18), obj_width - Inches(0.5), obj_height - Inches(0.36))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = num
    p.font.name = FONT_HEADING
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.space_after = Pt(4)
    
    p = tf.add_paragraph()
    p.text = title
    p.font.name = FONT_HEADING
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(6)
    
    p = tf.add_paragraph()
    p.text = desc
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

# ==============================================================================
# SLIDE 04: TECHNOLOGY STACK & TOOLING
# ==============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, "04 — TECHNOLOGY STACK & TOOLING", "Modern React Native ecosystem, end to end.")
add_footer(s4, 4)

stack_width = Inches(2.68)
stack_gap = Inches(0.33)
stack_lefts = [Inches(0.8) + i * (stack_width + stack_gap) for i in range(4)]
stack_h = Inches(4.0)

stack_cols = [
    ("REACT NATIVE CORE", [
        ("React Native 0.87.0", "New Architecture ready"),
        ("TypeScript 6.0 Strict", "100% type safety"),
        ("Hermes JS Engine", "Ahead-Of-Time (AOT) bytecode"),
        ("Yoga Flexbox Engine", "Cross-platform flex layout")
    ]),
    ("STATE & NAVIGATION", [
        ("Zustand 5.0", "Unidirectional reactive stores"),
        ("React Navigation 7.x", "Native Stack & Bottom Tabs"),
        ("React Native SVG", "Scalable vector pipeline"),
        ("Zero UI Kits", "Handcrafted artisanal tokens")
    ]),
    ("BUILD & PLATFORM", [
        ("Android Studio & SDK", "Target API 34 / 35"),
        ("Vivo 1919 Device", "Physical Android 12 testing"),
        ("Gradle 9 & JDK 21", "Native C++ CMake build"),
        ("Standalone Bundle", "Embedded assets (useDevSupport=false)")
    ]),
    ("TESTING & QUALITY", [
        ("Jest 29 & Renderer", "Unit tests for stores & math"),
        ("ESLint", "Zero warnings, clean quality"),
        ("Git & GitHub", "Public repository & CI"),
        ("Strict Compiler", "Zero errors in npx tsc")
    ])
]

for i, (cat_title, items) in enumerate(stack_cols):
    create_card(s4, stack_lefts[i], Inches(1.9), stack_width, stack_h)
    
    tb = s4.shapes.add_textbox(stack_lefts[i] + Inches(0.2), Inches(2.1), stack_width - Inches(0.4), stack_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = cat_title
    p.font.name = FONT_HEADING
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.space_after = Pt(16)
    
    for main_t, sub_t in items:
        p_m = tf.add_paragraph()
        p_m.text = main_t
        p_m.font.name = FONT_HEADING
        p_m.font.size = Pt(13)
        p_m.font.bold = True
        p_m.font.color.rgb = TEXT_WHITE
        p_m.space_after = Pt(1)
        
        p_s = tf.add_paragraph()
        p_s.text = sub_t
        p_s.font.name = FONT_BODY
        p_s.font.size = Pt(10)
        p_s.font.color.rgb = TEXT_MUTED
        p_s.space_after = Pt(10)

pill4 = create_card(s4, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.55), CARD_BG, CARD_BORDER)
tb_p4 = s4.shapes.add_textbox(Inches(1.1), Inches(6.25), Inches(11.133), Inches(0.35))
tf_p4 = tb_p4.text_frame
tf_p4.margin_left = tf_p4.margin_top = tf_p4.margin_right = tf_p4.margin_bottom = 0
p = tf_p4.paragraphs[0]
p.text = "● Bare React Native Community CLI workflow · Zero Expo bloat · Native Android SDK · Direct access to native Host"
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = ACCENT_SAGE

# ==============================================================================
# SLIDE 05: COMPONENT ARCHITECTURE & NAVIGATION
# ==============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, "05 — COMPONENT ARCHITECTURE & TOPOLOGY", "Hierarchical React Native component design.")
add_footer(s5, 5)

# Left Card: Flow diagram
c_flow = create_card(s5, Inches(0.8), Inches(1.9), Inches(6.6), Inches(4.8))
tb_f = s5.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(6.2), Inches(4.4))
tf_f = tb_f.text_frame
tf_f.word_wrap = False
tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0

p = tf_f.paragraphs[0]
p.text = "COMPONENT & NAVIGATION TOPOLOGY"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(14)

diagram_lines = [
    ("SafeAreaProvider  (Edge-to-edge Android display)", TEXT_WHITE, True),
    ("  └── NavigationContainer  (React Navigation 7 Context)", TEXT_WHITE, False),
    ("        └── RootNavigator  (Native Stack Navigator)", ACCENT_LIGHT, True),
    ("              ├── BottomTabNavigator  (Custom 5-Tab Bar)", TEXT_WHITE, False),
    ("              │     ├── RoasteryScreen  (Hero, Micro-Lots)", TEXT_MUTED, False),
    ("              │     ├── ExploreScreen  (Filters & Search)", TEXT_MUTED, False),
    ("              │     ├── SavedScreen  (Wishlist Favorites)", TEXT_MUTED, False),
    ("              │     ├── CartScreen  (Items & Shipping Meter)", TEXT_MUTED, False),
    ("              │     └── PalateScreen  (Profile & Quiz)", TEXT_MUTED, False),
    ("              ├── ProductDetails  (RoastMeter & Dial-In Guide)", TEXT_WHITE, False),
    ("              ├── CheckoutScreen  (Batch Scheduling & Pay)", TEXT_WHITE, False),
    ("              └── OrderTracking  (5-Stage Roastery Timeline)", TEXT_WHITE, False),
]

for line, col, is_b in diagram_lines:
    p = tf_f.add_paragraph()
    p.text = line
    p.font.name = "Courier New"
    p.font.size = Pt(10)
    p.font.bold = is_b
    p.font.color.rgb = col
    p.space_after = Pt(4)

# Right Card: React Native Core APIs
c_proj = create_card(s5, Inches(7.7), Inches(1.9), Inches(4.833), Inches(4.8))
tb_p = s5.shapes.add_textbox(Inches(7.95), Inches(2.1), Inches(4.333), Inches(4.4))
tf_p = tb_p.text_frame
tf_p.word_wrap = True
tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0

p = tf_p.paragraphs[0]
p.text = "REACT NATIVE CORE APIS UTILIZED"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(14)

apis = [
    ("<View> & <Text>", "Semantic structural primitives with strict typography hierarchy"),
    ("<ScrollView> & <FlatList>", "Virtualized lists with optimized keyExtractors & lazy rendering"),
    ("<Pressable>", "Modern touch handling with active tactile opacity & ripple"),
    ("<Modal>", "Native animated overlay for 3-step Palate Matcher Quiz"),
    ("StyleSheet.create()", "Cached, validated style objects compiled to native IDs"),
    ("Svg, Path, Circle", "Zero-dependency vector rendering via react-native-svg"),
    ("Platform & Dimensions", "Dynamic device notch, safe insets, and screen scaling")
]

for a_name, a_desc in apis:
    p = tf_p.add_paragraph()
    p.text = a_name
    p.font.name = "Courier New"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(1)
    
    p_sub = tf_p.add_paragraph()
    p_sub.text = a_desc
    p_sub.font.name = FONT_BODY
    p_sub.font.size = Pt(10)
    p_sub.font.color.rgb = TEXT_MUTED
    p_sub.space_after = Pt(6)

# ==============================================================================
# SLIDE 06: APPLICATION SCREENS & IMPLEMENTATION
# ==============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, "06 — APPLICATION SCREENS & IMPLEMENTATION", "Cross-platform screens in live execution.")
add_footer(s6, 6)

screens_info = [
    ("01 Home Screen", "FlatLists, hero banner & collections", IMG_HOME),
    ("02 Explore Screen", "Controlled TextInput & roast filters", IMG_EXPLORE),
    ("03 Details Screen", "Custom SVG RoastMeter & dial-in guide", IMG_DETAILS),
    ("04 Cart Screen", "Derived state, free shipping progress", IMG_CART),
]

mock_w = Inches(2.6)
mock_h = Inches(4.1)
mock_gap = Inches(0.44)
base_x = Inches(0.8)

for i, (title, sub, img_p) in enumerate(screens_info):
    cur_x = base_x + i * (mock_w + mock_gap)
    add_phone_mockup(s6, img_p, cur_x, Inches(1.9), mock_w, mock_h)
    
    tb = s6.shapes.add_textbox(cur_x, Inches(6.15), mock_w, Inches(0.7))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = title
    p.font.name = FONT_HEADING
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.space_after = Pt(2)
    
    p = tf.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = sub
    p.font.name = FONT_BODY
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_MUTED

# ==============================================================================
# SLIDE 07: STATE MANAGEMENT & UNIDIRECTIONAL FLOW
# ==============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, "07 — STATE MANAGEMENT & DATA FLOW", "Unidirectional data flow with Zustand in React Native.")
add_footer(s7, 7)

# Top Card: Why Zustand over Redux / Context API
c_comp = create_card(s7, Inches(0.8), Inches(1.9), Inches(11.733), Inches(1.6), CARD_BG, CARD_BORDER)
tb_comp = s7.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(11.233), Inches(1.3))
tf_comp = tb_comp.text_frame
tf_comp.word_wrap = True
tf_comp.margin_left = tf_comp.margin_top = tf_comp.margin_right = tf_comp.margin_bottom = 0

p = tf_comp.paragraphs[0]
p.text = "STATE MANAGEMENT PARADIGM COMPARISON"
p.font.name = FONT_HEADING
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf_comp.add_paragraph()
p.text = "• React Context API: Triggers full sub-tree re-renders on any state mutation, causing noticeable frame drops in lists."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = TEXT_MUTED
p.space_after = Pt(3)

p = tf_comp.add_paragraph()
p.text = "• Redux: Heavy boilerplate, actions/reducers ceremony, and oversized bundle footprint."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = TEXT_MUTED
p.space_after = Pt(3)

p = tf_comp.add_paragraph()
p.text = "• Zustand 5.0 (BrewBox Choice): Micro-store architecture with selective subscriptions (useCartStore(s => s.items)), immutable updates, zero boilerplate, and 60fps UI rendering."
p.font.name = FONT_BODY
p.font.size = Pt(11.5)
p.font.bold = True
p.font.color.rgb = ACCENT_SAGE

# Bottom: 4 Slices
slice_w = Inches(2.7)
slice_gap = Inches(0.31)
slice_lefts = [Inches(0.8) + i * (slice_w + slice_gap) for i in range(4)]
slice_h = Inches(2.9)

slices_data = [
    ("cartStore.ts", "Cart & Commerce", [
        "Item variants (Grind, Weight)",
        "Dynamic quantity steppers",
        "Free shipping meter (₹999)",
        "5% GST tax calculation",
        "Promo vouchers (ROASTMASTER15)"
    ]),
    ("wishlistStore.ts", "Favorites & Bookmarks", [
        "O(1) Set lookup by ID",
        "Optimistic UI toggling",
        "One-tap 'Move to Cart'",
        "Local device persistence",
        "Zero unnecessary re-renders"
    ]),
    ("filterStore.ts", "Catalog Predicates", [
        "Real-time search text filter",
        "Category tabs (Coffee, Tea)",
        "Roast level multi-select",
        "Micro-lot exclusivity flag",
        "Dynamic sorting algorithms"
    ]),
    ("userStore.ts", "Profile & Orders", [
        "Roastery Gold member tier",
        "Bean Rewards accumulation",
        "Saved delivery addresses",
        "Palate Persona taste leaning",
        "5-Stage live order batch tracking"
    ])
]

for i, (fname, ftitle, bullet_pts) in enumerate(slices_data):
    create_card(s7, slice_lefts[i], Inches(3.7), slice_w, slice_h)
    
    tb = s7.shapes.add_textbox(slice_lefts[i] + Inches(0.2), Inches(3.85), slice_w - Inches(0.4), slice_h - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = fname
    p.font.name = "Courier New"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.space_after = Pt(2)
    
    p = tf.add_paragraph()
    p.text = ftitle
    p.font.name = FONT_HEADING
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(8)
    
    for bp in bullet_pts:
        p_b = tf.add_paragraph()
        p_b.text = f"• {bp}"
        p_b.font.name = FONT_BODY
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = TEXT_MUTED
        p_b.space_after = Pt(4)

# ==============================================================================
# SLIDE 08: CROSS-PLATFORM STYLING & YOGA FLEXBOX
# ==============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, "08 — STYLING & YOGA FLEXBOX ENGINE", "Artisanal cross-platform design system.", "Leveraging React Native's Yoga Flexbox engine for consistent cross-platform layouts.")
add_footer(s8, 8)

c_ui = create_card(s8, Inches(0.8), Inches(1.9), Inches(8.5), Inches(4.8))
tb_ui = s8.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(8.0), Inches(4.4))
tf_ui = tb_ui.text_frame
tf_ui.word_wrap = True
tf_ui.margin_left = tf_ui.margin_top = tf_ui.margin_right = tf_ui.margin_bottom = 0

p = tf_ui.paragraphs[0]
p.text = "REACT NATIVE STYLING PRINCIPLES"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(12)

design_points = [
    ("01", "Yoga Flexbox Layout", "Pure Flexbox layout (flexDirection, justifyContent, alignItems, flexWrap) working identically across Android and iOS."),
    ("02", "Compiled StyleSheet API", "Styles defined outside render functions via StyleSheet.create(), compiled into native style IDs to reduce JS-to-native overhead."),
    ("03", "Artisanal Design Tokens", "Centralized palette tokens in src/theme/ (Terracotta #C86D3B, Obsidian #1A120B, Oat Cream #F9F6F0, Matcha Sage #2E4A35)."),
    ("04", "Bespoke Vector Pipeline", "30+ custom SVG glyphs (bean, dripper, teapot, flame) built with react-native-svg — zero icon font dependency."),
    ("05", "Interactive Sensory Widgets", "Custom visual 5-stage RoastMeter, multi-dimensional TasteProfileBar, and tactile 6-stage GrindSelector."),
    ("06", "Platform Shadow Adaptation", "Cross-platform depth elevation using Android elevation attribute alongside iOS shadowColor/shadowOffset tokens."),
    ("07", "Responsive SafeArea Design", "Seamless handling of Android status bar, camera hole-punch cutouts, and navigation gestures.")
]

for num, title, desc in design_points:
    p = tf_ui.add_paragraph()
    p.text = f"{num}  {title} — "
    p.font.name = FONT_HEADING
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    
    run = p.add_run()
    run.text = desc
    run.font.name = FONT_BODY
    run.font.bold = False
    run.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(7)

add_phone_mockup(s8, IMG_QUIZ, Inches(9.8), Inches(1.9), Inches(2.6), Inches(4.8))

# ==============================================================================
# SLIDE 09: PERFORMANCE OPTIMIZATION & HERMES
# ==============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, "09 — PERFORMANCE & RUNTIME OPTIMIZATION", "Engineering 60fps cross-platform interactions.")
add_footer(s9, 9)

perf_cards = [
    ("01", "Hermes JavaScript Engine", "Pre-compiles JavaScript into optimized bytecode Ahead-Of-Time (AOT). Eliminates runtime JS parsing, cuts app startup time (TTI) by ~50%, and minimizes RAM consumption."),
    ("02", "Atomic Zustand Selectors", "Components subscribe only to exact state slices (e.g. useCartStore(s => s.itemCount)), preventing parent re-renders from cascading down the virtual DOM tree."),
    ("03", "StyleSheet Caching", "Styles are declared once outside component lifecycles using StyleSheet.create(), avoiding memory allocations on every state update and caching style IDs on the native side."),
    ("04", "Pressable API with Ripples", "Uses modern React Native Pressable with hardware-accelerated ripple effects on Android and instant gesture response without touch delay."),
    ("05", "FlatList Virtualization", "Employs getItemLayout, initialNumToRender, and unique keyExtractors to recycle off-screen views, maintaining 60fps scrolling in product grids."),
    ("06", "Zero-Dependency SVGs", "Custom vector paths eliminate heavy font icon bundles or remote image requests, resulting in zero network lag during icon rendering."),
    ("07", "Edge-to-Edge SafeArea", "Hardware-accelerated window insets adaptation that prevents layout jumps when the Android keyboard or system navigation appears."),
    ("08", "Strict TypeScript 6.0", "Compile-time prop and state validation prevents runtime undefined errors and guarantees predictable component interfaces.")
]

s_w = Inches(2.7)
s_h = Inches(2.0)
s_gap_x = Inches(0.3)
s_gap_y = Inches(0.25)
s_xs = [Inches(0.8) + i * (s_w + s_gap_x) for i in range(4)]
s_ys = [Inches(2.0), Inches(2.0) + s_h + s_gap_y]

for idx, (num, title, desc) in enumerate(perf_cards):
    r = idx // 4
    c = idx % 4
    create_card(s9, s_xs[c], s_ys[r], s_w, s_h)
    
    tb = s9.shapes.add_textbox(s_xs[c] + Inches(0.2), s_ys[r] + Inches(0.18), s_w - Inches(0.4), s_h - Inches(0.36))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p = tf.paragraphs[0]
    p.text = num
    p.font.name = FONT_HEADING
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.space_after = Pt(2)
    
    p = tf.add_paragraph()
    p.text = title
    p.font.name = FONT_HEADING
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(4)
    
    p = tf.add_paragraph()
    p.text = desc
    p.font.name = FONT_BODY
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_MUTED

# ==============================================================================
# SLIDE 10: NATIVE BUILD PIPELINE & OFFLINE APK
# ==============================================================================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10)
add_header(s10, "10 — NATIVE BUILD PIPELINE & OFFLINE APK", "From JavaScript to standalone Android APK.", "Overcoming Metro dev-server dependencies for reliable offline execution on physical hardware.")
add_footer(s10, 10)

step_w = Inches(3.64)
step_h = Inches(4.0)

# Card 1: Pre-compiled Bundle
create_card(s10, Inches(0.8), Inches(1.9), step_w, step_h)
tb = s10.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(3.14), Inches(3.5))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

p = tf.paragraphs[0]
p.text = "STAGE 01"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf.add_paragraph()
p.text = "Offline Bundle Generation"
p.font.name = FONT_HEADING
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(12)

p = tf.add_paragraph()
p.text = "Pre-compiled JavaScript bundle and 19 vector drawable assets compiled into the native Android assets directory:\n\n• assets/index.android.bundle\n• res/drawable-* (19 assets)\n\nEliminates on-the-fly JavaScript bundling and network requests."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = TEXT_MUTED

# Card 2: Native Kotlin Host Override
create_card(s10, Inches(0.8) + step_w + Inches(0.4), Inches(1.9), step_w, step_h)
tb = s10.shapes.add_textbox(Inches(1.05) + step_w + Inches(0.4), Inches(2.15), Inches(3.14), Inches(3.5))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

p = tf.paragraphs[0]
p.text = "STAGE 02"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf.add_paragraph()
p.text = "useDevSupport = false"
p.font.name = FONT_HEADING
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(12)

p = tf.add_paragraph()
p.text = "Configured MainApplication.kt with useDevSupport = false in getDefaultReactHost:\n\n• Prevents Android from seeking Metro on port 8081\n• Eliminates 'Unable to load script' red screens\n• Forces Android to load embedded assets directly."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = TEXT_MUTED

# Card 3: Cold Boot Verification
create_card(s10, Inches(0.8) + (step_w + Inches(0.4)) * 2, Inches(1.9), step_w, step_h, CARD_BG_ALT, CARD_BORDER_ACCENT)
tb = s10.shapes.add_textbox(Inches(1.05) + (step_w + Inches(0.4)) * 2, Inches(2.15), Inches(3.14), Inches(3.5))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

p = tf.paragraphs[0]
p.text = "STAGE 03"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(6)

p = tf.add_paragraph()
p.text = "Physical Hardware Verification"
p.font.name = FONT_HEADING
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(12)

p = tf.add_paragraph()
p.text = "Verified on connected physical device (Vivo 1919):\n\n• Terminated all background Metro servers\n• Removed all adb reverse network tunnels\n• Cold boot via am force-stop\n• 0 fatal crashes, instant native render."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = TEXT_MUTED

pill10 = create_card(s10, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.55), CARD_BG, CARD_BORDER)
tb_p10 = s10.shapes.add_textbox(Inches(1.1), Inches(6.25), Inches(11.133), Inches(0.35))
tf_p10 = tb_p10.text_frame
tf_p10.margin_left = tf_p10.margin_top = tf_p10.margin_right = tf_p10.margin_bottom = 0
p = tf_p10.paragraphs[0]
p.text = "● Result: The user can disconnect the USB cable and open BrewBox from their app drawer anytime — 100% offline."
p.font.name = FONT_BODY
p.font.size = Pt(11)
p.font.color.rgb = ACCENT_SAGE

# ==============================================================================
# SLIDE 11: TESTING AND VALIDATION
# ==============================================================================
s11 = prs.slides.add_slide(blank_layout)
set_slide_background(s11)
add_header(s11, "11 — TESTING AND VALIDATION", "Rigorous verification across the React Native stack.")
add_footer(s11, 11)

c_flows = create_card(s11, Inches(0.8), Inches(1.9), Inches(5.6), Inches(4.8))
tb_fl = s11.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(5.1), Inches(4.4))
tf_fl = tb_fl.text_frame
tf_fl.word_wrap = True
tf_fl.margin_left = tf_fl.margin_top = tf_fl.margin_right = tf_fl.margin_bottom = 0

p = tf_fl.paragraphs[0]
p.text = "FLOWS TESTED ON PHYSICAL VIVO 1919 (ANDROID 12)"
p.font.name = FONT_HEADING
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(12)

flows = [
    "✓ Bottom Tab Navigation & Stack Transitions",
    "✓ Controlled Search & Multi-Criteria Filtering",
    "✓ Sensory RoastMeter 5-Stage Visual Scale",
    "✓ Multi-Dimensional TasteProfileBar Meters",
    "✓ Interactive 6-Stage Grind Selector",
    "✓ Barista Extraction Dial-In Brew Guides",
    "✓ Palate Matcher 3-Step Interactive Quiz",
    "✓ Dynamic Free Shipping Progress Meter (₹999)",
    "✓ Promo Code Engine (ROASTMASTER15, FIRSTBREW)",
    "✓ 5-Stage Live Roastery Batch Order Pipeline"
]

for flow in flows:
    p = tf_fl.add_paragraph()
    p.text = flow
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(7)

r_x = Inches(6.7)
r_w = Inches(5.833)

# Card 1: TypeScript
create_card(s11, r_x, Inches(1.9), r_w, Inches(1.35))
tb = s11.shapes.add_textbox(r_x + Inches(0.25), Inches(2.05), r_w - Inches(0.5), Inches(1.1))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
p = tf.paragraphs[0]
p.text = "TYPESCRIPT & CODE QUALITY"
p.font.name = FONT_HEADING
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(4)
p = tf.add_paragraph()
p.text = "npx tsc --noEmit && npm run lint"
p.font.name = "Courier New"
p.font.size = Pt(12)
p.font.color.rgb = TEXT_WHITE
p = tf.add_paragraph()
p.text = "● 0 errors · 0 warnings · 100% clean strict compilation"
p.font.name = FONT_BODY
p.font.size = Pt(10.5)
p.font.color.rgb = ACCENT_SAGE

# Card 2: Tests
create_card(s11, r_x, Inches(3.45), r_w, Inches(1.55))
tb = s11.shapes.add_textbox(r_x + Inches(0.25), Inches(3.6), r_w - Inches(0.5), Inches(1.3))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
p = tf.paragraphs[0]
p.text = "TEST SUITE & ANDROID BUILD"
p.font.name = FONT_HEADING
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(4)
p = tf.add_paragraph()
p.text = "Jest: 2 suites, 7/7 tests passed (cartStore & App)"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p = tf.add_paragraph()
p.text = "● Clean Gradle assembleDebug SUCCESS (10s build time)"
p.font.name = FONT_BODY
p.font.size = Pt(10.5)
p.font.color.rgb = ACCENT_SAGE

# Card 3: Version Control
create_card(s11, r_x, Inches(5.2), r_w, Inches(1.5))
tb = s11.shapes.add_textbox(r_x + Inches(0.25), Inches(5.35), r_w - Inches(0.5), Inches(1.2))
tf = tb.text_frame
tf.word_wrap = True
tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
p = tf.paragraphs[0]
p.text = "VERSION CONTROL & REPOSITORY"
p.font.name = FONT_HEADING
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(4)
p = tf.add_paragraph()
p.text = "github.com/Varadha9/BrewBox"
p.font.name = "Courier New"
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_LIGHT
p = tf.add_paragraph()
p.text = "Commit 3d9081f · Verified clean tree · Full documentation"
p.font.name = FONT_BODY
p.font.size = Pt(10.5)
p.font.color.rgb = TEXT_MUTED

# ==============================================================================
# SLIDE 12: CONCLUSION & CPAD LEARNING OUTCOMES
# ==============================================================================
s12 = prs.slides.add_slide(blank_layout)
set_slide_background(s12)
add_header(s12, "12 — CONCLUSION & LEARNING OUTCOMES", "Cross-platform mastery through BrewBox.")
add_footer(s12, 12)

c_conc = create_card(s12, Inches(0.8), Inches(1.9), Inches(5.6), Inches(4.8))
tb_c = s12.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(5.1), Inches(4.3))
tf_c = tb_c.text_frame
tf_c.word_wrap = True
tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0

p = tf_c.paragraphs[0]
p.text = "ACADEMIC & PRACTICAL LEARNING"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(12)

learnings = [
    ("Cross-Platform Efficiency", "Achieved 100% logic and component reuse across views with zero platform-specific divergence."),
    ("Component Modularity", "Designed handcrafted artisanal UI widgets without relying on bloated generic third-party UI libraries."),
    ("State Management Mastery", "Implemented atomic Zustand stores for 60fps rendering without Context API re-render penalties."),
    ("Native Packaging", "Overcame Metro dev-server constraints by mastering Android APK bundling and native Host overrides.")
]

for l_title, l_desc in learnings:
    p = tf_c.add_paragraph()
    p.text = f"• {l_title}: "
    p.font.name = FONT_HEADING
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    
    run = p.add_run()
    run.text = l_desc
    run.font.name = FONT_BODY
    run.font.bold = False
    run.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(6)

p = tf_c.add_paragraph()
p.text = "Thank you — questions welcome."
p.font.name = FONT_HEADING
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = ACCENT_LIGHT
p.space_before = Pt(8)

c_fut = create_card(s12, Inches(6.7), Inches(1.9), Inches(5.833), Inches(4.8), CARD_BG_ALT, CARD_BORDER_ACCENT)
tb_ft = s12.shapes.add_textbox(Inches(6.95), Inches(2.15), Inches(5.333), Inches(4.3))
tf_ft = tb_ft.text_frame
tf_ft.word_wrap = True
tf_ft.margin_left = tf_ft.margin_top = tf_ft.margin_right = tf_ft.margin_bottom = 0

p = tf_ft.paragraphs[0]
p.text = "FUTURE SCOPE & EXTENSIONS"
p.font.name = FONT_HEADING
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = ACCENT_AMBER
p.space_after = Pt(14)

future_items = [
    ("01", "Supabase Cloud Backend", "PostgreSQL database integration for user authentication, live catalog synchronization, and cloud order persistence."),
    ("02", "Razorpay Native Gateway", "Production payment gateway SDK integration supporting instant UPI Intent, Cards, and Net Banking."),
    ("03", "Cross-Platform iOS & iPadOS", "Native iOS compilation and testing with Apple Pay and iPad split-view optimization."),
    ("04", "Push Notifications via FCM", "Firebase Cloud Messaging alerts notifying users of newly dropped seasonal micro-lots and roasting days."),
    ("05", "Smart Bluetooth Scale Sync", "Bluetooth Low Energy (BLE) integration with smart scales and kettles for real-time extraction flow-rate guidance.")
]

for num, title, desc in future_items:
    p = tf_ft.add_paragraph()
    p.text = f"{num}  {title}"
    p.font.name = FONT_HEADING
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(2)
    
    p_desc = tf_ft.add_paragraph()
    p_desc.text = desc
    p_desc.font.name = FONT_BODY
    p_desc.font.size = Pt(10)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.space_after = Pt(8)

output_path = "/home/varad/projects/BrewBox/BrewBox_Jury_Presentation.pptx"
prs.save(output_path)
print(f"Presentation saved successfully to: {output_path}")
