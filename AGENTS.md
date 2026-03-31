# AGENTS.md — openad.me(OpenAd)

This repository contains product description, frontend, product logic, for **openad.me**, an open canvas platform where anyone can post anything on a personal board.

---

## 🧠 Product Philosophy
> “post anything”
**openad is a open canvas**

A place where:
* users can freely express on his/her own canvas
* drop anything (text, image, link, video, product)
* write notes

The system is intentionally:

* unstructured
* visual-first
* spatial (not list-based)

---

## 🎯 Core Concept
### Open Canvas

Each user owns a **board (canvas)**:
* freeform layout
* drag & drop elements
* no strict structure

### Open Board (The Explore - Feature)

A global shared space:
* contains boards from all users
* displayed in a canvas-like environment
* encourages discovery

---

## 🧩 Core Features
### 1. Explore (Public Board)

* Default landing menu experience
* Shows multiple user boards in a shared canvas
* Infinite / scrollable / pannable space (future)
* Content is PUBLIC by default

#### Rules:

* All boards are public unless user upgrades
* No heavy algorithm initially (random / latest)

---

### 2. Your Canvas (User's Board)

Each user has:
* sharable unique URL: `openad.me/{username}`
* editable personal canvas

#### Capabilities:

* Add elements:
  * Text
  * Image
  * Link 
  * Video (embed)
  * Box (button with link)
* Drag & drop positioning
* Resize elements
* Layering (z-index)

* Auto-Preview

#### UX Principles:

* Freeform but not messy
* Soft snap alignment (optional grid)
* Instant visual feedback


### 2.5. Board Preview
* Right-side preview panel 
* Mobile-style preview 
* Reflects real user board

---

### 3. Go to canvas

* User can visit his/her canvas via unique url

---

## 🖥️ Interface Structure

### Layout (OpenAd Dashboard = index.html )

#### Left Sidebar

* Discover (Explore)
* Your Link:
  * Homepage
  * Insights

#### Tools

* Link Shortener (future)

---

### Main Canvas Area

* Primary working space
* White/neutral background
* Rounded container

---

### Right Panel (Preview)

* Mobile-style preview
* Real-time reflection of board
* Shows:

  * profile
  * content cards
  * CTA

---

## 🎨 Design System

### Visual Direction

* Clean SaaS dashboard
* Minimal but soft
* High whitespace

### Typography

* Sans-serif (modern, clean)
* Similar to:
  * Inter / system UI fonts

---

### Components

* Buttons: similar to **shadcn/ui**
* Cards: rounded, subtle shadow
* Toggle: minimal, modern

---

### Icons

* Use **Google Material Icons**

---

### Color

* Neutral base (white / gray)
* Accent: black / dark CTA
* Avoid overly colorful UI (content should stand out)

---

## 🧠 Interaction Model

### Drag & Drop

* Core interaction
* Elements must be:

  * draggable
  * resizable
  * editable inline

---

### Element System

Each element has:

```
{
  id,
  type: "text" | "image" | "link" | "video" | "box",
  position: { x, y },
  size: { w, h },
  content: {},
  style: {}
}
```

---

### Rendering

* Absolute positioning inside canvas
* Responsive fallback (stacking on mobile if needed)

---

## 🔗 URL Structure

* Home: `/`
* Explore: `/explore`
* User board: `/{username}`

---

## ⚙️ Future Expansion

* Collaboration (multi-user board)
* Public drop zone (shared canvas)
* Monetization blocks (sell directly)
* NFT / wallet integration
* Spatial search (zoomable world)

---

## ⚠️ Product Constraints

* Do NOT turn this into a list-based product
* Do NOT over-structure layouts
* Do NOT prioritize monetization over expression (early stage)

---

## 🧭 North Star

> A place where anyone can open a page and instantly:
>
> * understand
> * create
> * express

---

## ✨ Success Criteria

A new user should:

* understand what to do within 10 seconds
* create something within 1 minute
* feel ownership of their space

---

## 🔥 Tagline

**openad**
post anything

---

## 🧪 Build Priority

1. Canvas rendering
2. Drag & drop system
3. Add element flow
4. Public board rendering
5. Basic explore

---

## 🧑‍💻 Developer Notes

* Prioritize speed over perfection
* Ship early, iterate fast
* Keep system modular (element-based)

---

End of file.
