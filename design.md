# Team1 Member Portal - Design System

## Colors
- **Background**: Very Dark Grey/Black `#0A0A0A`
- **Surface/Card**: Dark Grey `#141414` (approximate, used for the main form container)
- **Input Background**: Darker Grey `#1A1A1A`
- **Input Border**: Dark Grey `#262626` (Hover/Active slightly lighter)
- **Primary Accent**: Vibrant Green `#00C652` (approximate bright green)
- **Text Primary**: White `#FFFFFF`
- **Text Secondary**: Light Grey `#A3A3A3`
- **Text Muted**: Darker Grey `#737373`

## Typography
- **Font Family**: Modern Sans-Serif (e.g., Inter, Outfit, or Roobert)
- **Headings**: Extremely bold (800/900 weight), tight tracking
- **Body**: Regular (400) and Medium (500) for labels

## Layout
- **Container**: Split screen design on desktop (Left: ~40%, Right: ~60%)
- **Left Panel**: Fixed position, vertical flex layout, large typography, subtle green globe/dotted background graphic.
- **Right Panel**: Scrollable area, contains form steps.

## Components

### 1. Stepper
- 4 steps: About, Interests, Experience, Contribution
- Active/Completed step: Green circle with checkmark or number, white text.
- Inactive step: Dark grey circle with number, grey text.
- Connector lines between steps.

### 2. Form Inputs
- **Text Input / Textarea**: Rounded corners (lg), dark background, subtle border, placeholder text, optional leading icon.
- **Section Headers**: Small bold text with a 2px green left border (e.g., "Personal info").
- **Selectable Cards**: Custom radio/checkbox cards with icons, title, and description. Active state has a green border, slight green tint background, and checkmark/radio indicator.

### 3. Buttons
- **Primary**: Solid green background, white text, rounded pill shape, right arrow icon.
- **Secondary/Ghost**: Transparent background, white text, left arrow icon.
- **Icon Button**: Dark rounded square for the dark/light mode toggle.
