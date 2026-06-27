# FORM 2
## THE PATENTS ACT, 1970
(39 of 1970)
&
## THE PATENTS RULES, 2003

# PROVISIONAL SPECIFICATION
(See section 10 and rule 13)

---

### 1. TITLE OF THE INVENTION
**SYSTEM AND METHOD FOR METABOLIC TELEMETRY SYNCHRONIZATION AND DYNAMIC BIO-FEEDBACK VISUALIZATION**

---

### 2. APPLICANT(S)
*   **Name:** ROSHAN AHMED A
*   **Nationality:** Indian
*   **Address:** 4/88, Samayapuram Nagar, Kozhumanivakkam, PO: Mangadu, Chennai, Tamil Nadu, India

---

### 3. PREAMBLE TO THE DESCRIPTION

**THE FOLLOWING SPECIFICATION DESCRIBES THE INVENTION:**

---

### 4. DESCRIPTION

#### I. FIELD OF THE INVENTION
The present invention relates generally to medical telemonitoring, and more particularly to systems, computer-implemented methods, and user interfaces that collect multi-variate biomarker telemetry and translate said telemetry into a dynamic, real-time three-dimensional predictive visual representation modeling metabolic health and glycemic trajectory.

#### II. BACKGROUND OF THE INVENTION
Metabolic disorders, particularly pre-diabetes and Type 2 Diabetes, represent a massive global health burden. Clinical research shows that pre-diabetes is highly reversible through targeted lifestyle interventions, such as physical activity timed to postprandial glucose peaks. However, patient compliance with complex daily protocols is extremely low due to a lack of immediate, intuitive feedback loops.

Conventional health tracking applications function as static, retrospective digital diaries. They require users to input numbers (e.g., blood sugar in mg/dL, step counts) which fail to communicate the immediate biological impact of behavioral choices. Furthermore, existing systems do not visually connect food intake, biometric feedback, and required corrective actions (such as physical exercise) in a unified, predictive closed-loop interface.

Therefore, there exists a critical need for an intelligent metabolic monitoring platform that translates raw health telemetry into a dynamic, three-dimensional digital replica of a user’s biological state, while dynamically predicting glycemic spikes and orchestrating timely behavioral interventions.

#### III. SUMMARY OF THE INVENTION
The present invention provides a system, method, and non-transitory computer-readable medium for a **Metabolic Telemetry Synchronization and Dynamic Bio-Feedback Platform (Predinex)**.

Key aspects of the invention include:
1.  **A Dynamic Metabolic Bio-Twin Rendering Engine:** A system that ingests multi-variate user biomarkers (such as fasting glucose, sleep hours, water consumption, and physical activity) and executes a proprietary translation formula to render an interactive, three-dimensional biological model (represented as a rotating helical structure). The model dynamically shifts its scale, rotation axis, animation speed, and color spectra (e.g., shifting along a HSL gradient from a stable emerald to a calibrating/risky amber/red) to visually represent metabolic stability.
2.  **An Interactive Perspective-Tracking UI:** A user interface that tracks coordinate positions of a user input pointer (mouse cursor or touch coordinates) relative to a bounding container and applies spring-damper equations to dynamically tilt the 3D model in three dimensions, establishing a tangible depth experience ("holographic effect") that drives user engagement.
3.  **A Closed-Loop Glycemic Impact & Walk-Scheduling Engine:** A predictive module that analyzes text or voice inputs describing meal consumption, parses the input against a food database mapping ingredients (including regional South Asian cuisines) to glycemic indexes, estimates the postprandial glucose spike risk, and schedules a physical walking timer designed to utilize muscle-contraction GLUT4 glucose uptake mechanisms independent of insulin.
4.  **A Voice-Assisted Accessibility Pipeline:** A speech-processing module supporting real-time local multilingual text-to-speech and speech-to-text (e.g., in English, Hindi, and Tamil) to announce high glycemic hazard warnings instantly to visually impaired or low-literacy users.

#### IV. DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS
Hereinafter, the components, algorithms, and logical pipelines of the present invention are described in detail.

##### 1. System Architecture & Workflows
The platform comprises:
*   **A Mobile/Web Client Application:** Providing the dynamic UI, executing framer-motion animations, and collecting voice/text inputs.
*   **An Application Server:** Processing server actions and hosting the business logic.
*   **A Local/Remote Database:** Storing user profiles, historical biomarker logs, and glycemic index mapping tables.
*   **A Neural Core Intelligence Engine:** Synthesizing biomarker streams, calculating glycemic risks, and driving conversational diagnostic feedback.

The metabolic reversal pipeline is executed across three operational phases:
*   **Phase 1: Diagnostic Mapping:** Includes secure registration with locally encrypted credentials, direct intake of user baseline vitals (blood glucose, BMI, family medical history, and lifestyle markers), and local secure database storage.
*   **Phase 2: Intelligence & 3D Bio-Twin Generation:** Evaluates user metrics to calculate a precision Metabolic Risk Profile. Renders the interactive 3D Metabolic Bio-Twin on the dashboard in real-time.
*   **Phase 3: Targeted Interventions:** Curated, glycemic-index-mapped diet plans targeting insulin resistance, glycogen depletion, and insulin-sensitivity-boosting exercise protocols, alongside breathing algorithms and mindfulness protocols to reduce cortisol.
*   **Continuous Feedback Loop:** Continuous bluetooth synchronization updates the local database with step and sleep logs, triggering the intelligence engine to dynamically update the Metabolic Risk Profile and redraw the Bio-Twin state.

##### 2. The Metabolic Bio-Twin Calculations and 3D Perspective Rotation
The system converts daily health metrics into three distinct scores:
*   **Insulin Sensitivity Index ($S_{ins}$):** Calculated dynamically using logged blood sugar telemetry ($G_{fast}$):
    $$S_{ins} = \max\left(10, 100 - \max(0, G_{fast} - 90) \times 0.7\right)$$
*   **Glucose Regulation Index ($S_{gluc}$):** Calculated using the core clinical assessment score ($S_{assess}$):
    $$S_{gluc} = \max\left(10, 100 - \max(0, G_{fast} - 85) \times 0.8\right)$$
*   **Energy and Lifestyle Score ($S_{life}$):** Synthesizing sleep hours ($H_{sleep}$), water intake ($W_{water}$), and sunlight exposure ($M_{sun}$):
    $$S_{life} = \left(\frac{H_{sleep}}{8} \times 40\right) + \left(\frac{W_{water}}{2500} \times 30\right) + \left(\frac{M_{sun}}{20} \times 20\right) + \left(S_{assess} \times 10\right)$$

To render the 3D Bio-Twin, the system tracks the cursor coordinate $(X_{cursor}, Y_{cursor})$ relative to the card's bounding rectangle. Motion values are transformed to angles:
$$\theta_X = \text{Spring}\left(Y_{cursor} \to [-300, 300] \Rightarrow [12^\circ, -12^\circ]\right)$$
$$\theta_Y = \text{Spring}\left(X_{cursor} \to [-300, 300] \Rightarrow [-12^\circ, 12^\circ]\right)$$

The avatar is tilt-rendered along these angles under a 3D perspective projection space of $1800\text{px}$. Simultaneously, a visual scan line translates vertically from $0\%$ to $100\%$ height over a continuous repeating cycle, and the model rotates about its vertical Y-axis continuously at a constant rate.

##### 3. Closed-Loop Glycemic Prediction and Active Intervention
The system parses meal input text, extracts matching foods $\{f_1, f_2, ..., f_n\}$, and computes:
$$\text{Carbs}_{total} = \sum_{i=1}^n \text{Carbs}(f_i)$$
$$\text{GI}_{avg} = \frac{1}{n} \sum_{i=1}^n \text{GI}(f_i)$$

*   **High Risk:** Triggered if $\text{GI}_{avg} > 70$ or $\text{Carbs}_{total} > 40\text{g}$.
*   **Actionable Prescription:** Schedules a notification 10 minutes post-meal instructing the user to perform a 10-15 minute walk, maximizing non-insulin-dependent glucose disposal through active muscle groups.

---

### 5. CLAIMS (Optional for Provisional filing, but included for scope mapping)

**WE CLAIM:**

1.  **A system for metabolic telemetry synchronization and dynamic bio-feedback visualization, comprising:**
    *   a database storing user profile records, daily biomarker logs including blood glucose levels, sleep hours, water consumption, and assessment risk scores;
    *   a user interface module executing on a client device configured to render a three-dimensional perspective container; and
    *   a processor configured to calculate metabolic indices using the daily biomarker logs, render a three-dimensional helical structure within the perspective container representing a digital bio-twin of a user, track coordinates of a pointer on the user interface relative to a center point of the container, and apply a spring-damper transform to tilt the helical structure dynamically, creating a holographic depth effect.

2.  **A computer-implemented method for dynamic bio-feedback visualization, comprising:**
    *   ingesting a stream of multi-variate biomarker telemetry comprising at least a glucose level, a sleep duration, and an exercise step count;
    *   computing an insulin sensitivity index based on a deviation of the glucose level from an ideal fasting threshold;
    *   rendering a three-dimensional helical model on a screen, the model having a color mapping along an HSL spectrum that shifts dynamically from green to amber based on the computed insulin sensitivity index;
    *   detecting a user coordinate interaction on the screen; and
    *   applying a spring transition function to tilt the coordinate axis of the three-dimensional helical model relative to the user coordinate interaction to simulate physical depth.

---

### 6. DATE AND SIGNATURE
**Dated this 13th Day of June, 2026**

**Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Name of the Applicant:** ROSHAN AHMED A
