# AgentBlazer component library

The AgentBlazer prototype uses a compact dark/neon visual language based on the provided organisation visual: deep ink `#07121f`, electric purple `#723cff`, lime `#d7ff54`, warm orange `#ff8b52`, and paper `#f5f8fa`. Typography uses **Manrope** for interface and display text with **DM Mono** for metadata, labels, and dates.

## Navigation

The sticky header includes the AgentBlazer wordmark, five page links, an active state with a purple underline, a primary “Join the club” CTA, and a responsive mobile menu state. All internal navigation is clickable through the prototype’s hash-based flow.

## Buttons

| Variant | Use | States |
|---|---|---|
| Primary | Main conversion actions such as “Join the movement” and “Send it” | Default purple fill, hover lift/shadow, active scale response |
| Cream | CTA on purple backgrounds | Cream fill, dark ink text, hover lift/shadow |
| Secondary | Lower-emphasis actions such as “See all events” | Transparent fill, ink border |
| Text button | Inline discovery and page-to-page links | Transparent, arrow affordance, purple accent |
| Icon button | Event row actions | Circular outlined default, purple hover fill |

## Cards

**Event card** uses a date rail, type tag, title, description, metadata row, and arrow action. It appears on Home and Events and stacks cleanly on mobile.

**Principle card** uses a numbered corner label, icon, heading, and supporting text. The middle card is a dark inverse state to create hierarchy.

**Person card** uses a colour-block avatar, initials, name, role metadata, and divider. The color-block avatar is an approved visual placeholder derived from the club palette rather than external stock imagery.

## Pages and prototype flow

Home links to About, Events, and Join. About links to Join. Events links to Join through each event row and the newsletter CTA. Team is available from the global navigation. Join includes a working client-side form success state.

## Responsive frames

Desktop layouts target a wide 1180px content shell. Mobile rules activate below 800px: the navigation collapses, the hero art scales down, principles and value grids stack, event rows compress, and Home and Events remain fully usable as responsive pages.
