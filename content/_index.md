---
# Leave the homepage title empty to use the site title
title:
date: 2023-09-23
type: landing

sections:
  - block: hero
    content:
      title: Learn to Build Software That Is Easy to Maintain
      image:
        filename: home.png
      cta:
        label: Visit My Channel
        url: https://youtube.com/@codewitharho
        icon_pack: fab
        icon: youtube
      text: |-
        > Complex topics. Understandable guides.
      
        Easy to digest software development tutorials, and tips on how to become a better software developer. Save time, frustration and do a better job.
      
        Specialized in Java/Kotlin and Spring Boot.
        
        <p></p>
      cta_note:
        label: Check out my YouTube channel if you prefer video tutorials.
  - block: collection
    id: posts
    content:
      title: Recent Articles
      subtitle: ''
      text: ''
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        folders:
          - post
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: compact
      columns: '2'
  - block: collection
    id: featured
    content:
      title: Featured Articles
      subtitle: Trending Now
      filters:
        folders:
          - post
        featured_only: true
    design:
      columns: '2'
      view: compact
---
