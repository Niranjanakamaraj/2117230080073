# Campus Notifications Microservice - Stage 1

## Overview
This document outlines the design and implementation approach for the Stage 1 Campus Notifications Priority Inbox.

## Approach for Maintaining Top 10 Notifications Efficiently

The core requirement is to display the top 10 most important unread notifications based on a combination of weight and recency.
- **Weight**: Placement (3) > Result (2) > Event (1).
- **Recency**: Newer timestamp has higher priority when weights are equal.

### Data Structure Selection
As new notifications continuously arrive, we need an efficient way to maintain exactly the top 10 items without storing or sorting the entire unbounded history.

1. **Min-Heap (Optimal)**:
   The most efficient data structure for maintaining the top `N` items in a streaming data scenario is a Min-Heap of size `N`.
   - The heap orders elements by their priority (weight + recency).
   - Crucially, the *root* of the Min-Heap is the *lowest* priority notification currently in our top 10 list.
   - When a new notification arrives:
     - If the heap has fewer than 10 elements, we simply insert it `O(log N)`.
     - If the heap has 10 elements, we compare the new notification's priority with the root.
     - If the new notification is of higher priority, we extract the root and insert the new notification `O(log N)`.
     - Otherwise, we discard the new notification `O(1)`.

   This ensures `O(M log N)` time complexity for `M` incoming messages and strictly `O(N)` memory usage, making it highly scalable even for a massive volume of incoming notifications.

2. **Array Sort & Slice (Implemented for Frontend Mock)**:
   For simple, immediate UI rendering where the payload is pre-filtered or reasonably small (e.g., initial batch fetch), a standard sort and slice `O(K log K)` is computationally negligible on modern clients. However, for continuous streaming on the backend or service worker, the Min-Heap approach described above is the intended scalable design.

## Architecture
The repository is structured into isolated packages:
- `notification_app_fe`: Next.js frontend application.
- `notification_app_be`: Reserved for backend services.
- `logging_middleware`: A reusable custom logging package shared across the ecosystem.
