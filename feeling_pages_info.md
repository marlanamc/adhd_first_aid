

## ✅ Refined Prompt

> I have a folder called **"Feelings Pages"** — each file is a markdown file for a specific emotional state that ADHDers experience (e.g., Anxious, Ashamed, Burned Out, etc.).

For each page, I want you to format the content using the following structure:

---

### 🧱 Layout + Structure (in markdown or code-based layout system like MDX, JSX, or Markdown + shortcodes):

1. **Title** (Feeling name)
    
2. **Subtitle (One-liner ADHD Reframe):**  
    Place directly under the title. Example:
    
    ```
    It’s not weakness • It’s not overreacting • It’s ADHD meeting nervous system dysregulation, hypervigilance, and too many open tabs in your mind.
    ```
    
3. **Intro Paragraph:**  
    Use the first paragraph (formerly “comforting reminder”) as a welcoming explanation of the emotional state. Tone: compassionate, validating, clear.
    
4. **Side-by-Side Toggle Boxes:**  
    These should each be a **collapsible toggle** component.
    
    **Left Box:**
    
    - Title: **Gentle Advice**
        
    - Inside: the “Gentle Advice” block
        
    
    **Right Box:**
    
    - Title: **Give It to Me Straight**
        
    - Inside: the “Stern Advice” block
        
5. **Section: 🧠 Why ADHD Makes [Feeling] Worse**
    
    - Keep the bullet point format exactly as is.
        
    - Replace `[Feeling]` dynamically based on the page (e.g., "Why ADHD Makes Shame Worse")
        

---

### 📦 Data Strategy

Since this will eventually scale to many feelings, I recommend storing the data in a **structured JSON or Markdown with frontmatter** like this:

```markdown
---
title: Ashamed
subtitle: It’s not a character flaw • It’s not proof you’re broken • It’s ADHD meeting impossible standards, rejection, and years of internalized blame.
intro: Shame hits hard when you feel like you’ve let someone down — especially yourself. For many with ADHD, shame is a chronic background noise...
gentle_advice: >
  You were doing your best with the tools you had. Shame doesn’t mean you’re bad — it means you care. 
  That’s not something to fix — it’s something to honor while building better support.
stern_advice: >
  Stop letting shame write your story. You messed up? Own it, learn, and move forward. 
  You can’t grow if you’re hiding from your own life.
adhd_reasons:
  - Chronic lateness and disorganization erode self-trust over time.
  - Rejection Sensitivity (RSD) turns small slip-ups into intense self-criticism.
  - Working memory gaps make it easy to forget what matters — and blame yourself after.
  - Masking for long periods leads to identity confusion and self-doubt.
---
```

This structure allows for programmatic generation of pages, toggle behavior, and dynamic rendering later if needed.

---

### 🧪 Test Case:

Let’s start with **Ashamed**. Can you generate this layout exactly as described using the content I’ve provided? Then we can refine it together before moving on to the full set.

