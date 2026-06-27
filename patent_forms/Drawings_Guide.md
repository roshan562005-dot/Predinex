# DRAWINGS SPECIFICATION GUIDE FOR PREDINEX

In Indian patent applications, drawings must be filed on separate sheets (usually A4 size) with a margin of at least 25 mm on the top and left, 15 mm on the bottom, and 10 mm on the right. 

You should place each of the following diagrams on its own sheet in your final PDF document.

---

### SHEET 1: SYSTEM BLOCK DIAGRAM (Figure 1)
*   **Title of Sheet:** Sheet 1 of 2
*   **Figure Label:** FIGURE 1 (SYSTEM BLOCK DIAGRAM)
*   **Content to Draw/Print:**

```
   ┌──────────────────────────────────────────────────────────┐
   │                       USER [100]                         │
   └───────────────────────────┬──────────────────────────────┘
                               │ (Interacts via UI & Voice)
                               ▼
   ┌──────────────────────────────────────────────────────────┐
   │             MOBILE/WEB CLIENT APPLICATION                │
   │           - 3D perspective Bio-Twin UI                   │
   │           - Meal Analyzer Voice UI                       │
   └───────────────────────────┬──────────────────────────────┘
                               │ (Server Actions & API Calls)
                               ▼
   ┌──────────────────────────────────────────────────────────┐
   │                 APPLICATION SERVER [200]                 │
   └───────┬───────────────────────────────────────┬──────────┘
           │ (SQL Queries)                         │ (Context Queries)
           ▼                                       ▼
 ┌───────────────────┐                   ┌────────────────────┐
 │  BETTER-SQLITE3   │                   │    NEURAL CORE     │
 │   LOCAL DATABASE  │                   │ INTELLIGENCE ENG.  │
 │      [300]        │                   │      [400]         │
 └───────────────────┘                   └────────────────────┘
```

---

### SHEET 2: PLATFORM WORKFLOW DIAGRAM (Figure 2)
*   **Title of Sheet:** Sheet 2 of 2
*   **Figure Label:** FIGURE 2 (END-TO-END WORKFLOW)
*   **Content to Draw/Print:**

```
 Phase 1: Diagnostic Mapping
 ┌──────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
 │ User Onboarding  ├─────►│ Cinematic Assessment├─────►│  Local DB Log       │
 └──────────────────┘      └─────────────────────┘      └──────────┬──────────┘
                                                                   │
                                                                   ▼
 Phase 2: Twin Generation                               ┌──────────┴──────────┐
                                                        │  Intelligence Eng.  │
                                                        └──────────┬──────────┘
                                                                   │
                                                                   ▼
 Phase 3: Targeted Interventions                        ┌──────────┴──────────┐
 ┌──────────────────┐      ┌─────────────────────┐      │  3D Bio-Twin Render │
 │Precision Diet    │◄─────┤   Dynamic Workouts  │◄─────┤    on Dashboard     │
 └────────┬─────────┘      └──────────┬──────────┘      └──────────┬──────────┘
          │                           │                            │
          └───────────────────────────┼────────────────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │Goal: Metabolic Risk Reversed │
                       └──────────────┬───────────────┘
                                      │ (Continuous Bluetooth Feedback Loop)
                                      ▼
                        (Return to Local DB Log)
```
