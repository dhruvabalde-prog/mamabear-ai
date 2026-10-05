---
name: gmail-read-write
description: >-
  Reads, searches, drafts, and sends emails for Maple Bear Canadian School Subhash Nagar Kota co-founders. Handles prospective doctor/faculty parent inquiries, vendor quotations, teacher interview invites, and Canadian curriculum dispatches with full OAuth integration.
---

# Gmail Read & Write Skill for Preschool Partners

## Overview
Empowers co-founders Priya Sharma (Academic Director) and Ananya Verma (Managing Director) to read incoming inquiries from Kota parents and send structured, professional, Canadian-pedagogy-aligned replies.

## Supported Operations

### 1. Read / List Messages (`listGmailMessages`)
- **Query Filters**: `from:doctor`, `label:INBOX`, `has:attachment`, `is:unread`
- **Output Data**: `id`, `threadId`, `from`, `subject`, `date`, `snippet`, `body`, `unread` status.

### 2. Send Message (`sendGmailMessage`)
- **Parameters**: `to`, `subject`, `body`
- **Formatting**: RFC 2822 standard with Base64 URL-safe encoding.

### 3. Create Draft (`createGmailDraft`)
- Allows co-founders to stage AI-generated responses (e.g., Canadian nursery brochures, fee schedules for Allen/Resonance faculty) for review before sending.

## Standard Preschool Email Templates

### Prospective Parent Response (Kota Medical & Coaching Focus)
```text
Subject: Welcome to Maple Bear Canadian Pre-School Subhash Nagar, Kota!

Dear Dr./Er. [Parent Name],

Thank you for your interest in Maple Bear Canadian Pre-School, Subhash Nagar, Kota. We are thrilled to welcome [Child Name] (Age [Child Age]) for [Target Grade].

As fellow mothers of 3-year-olds in Kota, we established this center to bring world-renowned Canadian early inquiry learning, immersion English, anti-finger-trap physical safety, and heat-adapted indoor play lawns to Subhash Nagar.

We invite your family for a private personalized campus tour this week.

Warm regards,
Priya Sharma & Ananya Verma
Co-Founders, Maple Bear Canadian Pre-School Subhash Nagar, Kota
+91 98290 41234 / +91 98290 85678
```
