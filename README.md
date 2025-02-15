# 🩺 DocFlow: Intelligent Healthcare Access Orchestrator 🚀

![DocFlow Banner](https://files.catbox.moe/3oxeax.webp)

**A Hackathon Solution to Streamline Patient Journeys & Reduce Wait Times in Healthcare**

[![Hackathon Name Badge](https://img.shields.io/badge/Hackathon-Nameless-blue.svg)](https://hackathon.example.com) [![Built With Python](https://img.shields.io/badge/Built%20With-Python-blue.svg)](https://www.python.org/) [![Frontend with React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org/) [![GitHub license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/copeugne/Hackathon-AISummit/blob/main/LICENSE)

---

<a href="https://files.catbox.moe/qquku5.png">
  <img src="https://files.catbox.moe/qquku5.png" width="509" height="773"/>
</a>

## 🎯 The Challenge: Healthcare Access Bottlenecks

In many regions, including Île-de-France, patients face long waiting periods for specialist care. These delays can lead to:
- **Delayed diagnoses**
- **Increased patient anxiety**
- **Potentially poorer health outcomes**

Existing systems often lack the intelligence to efficiently manage demand, optimize resource allocation, and guide patients to the most appropriate, timely care pathway.

---

## 💡 Our Solution: DocFlow

**DocFlow** is an AI-powered platform designed to revolutionize patient access to healthcare by:
- **Predicting & Reducing Wait Times:** Forecasting appointment demand to guide patients toward faster care options.
- **Optimizing Teleconsultation (TCS):** Recommending TCS as a viable, faster alternative to in-person visits.
- **Streamlining Patient Journeys:** Offering a smart triage and booking flow to efficiently direct patients to the right specialty and appointment type.

> [!IMPORTANT]
> **Demo Focus:** Reducing waiting times for Cardiology appointments in Île-de-France through a user-friendly Patient Portal experience.

---

## ✨ Key Features (MVP Demo)

- **Patient-Centric Triage:**  
  An intuitive portal where patients select their region, desired specialty (Cardiology in Île-de-France), and urgency.

- **Intelligent Waiting Time Comparison:**  
  A side-by-side display comparing:
  - **Current Wait Times:** Typical in-person delays based on real data.
  - **DocFlow Optimized Wait Times:** A significantly reduced predicted waiting time using our AI-driven booking system.

- **Smart Teleconsultation Recommendation:**  
  Dynamic guidance towards Teleconsultation for routine or non-critical check-ups when in-person wait times are long.

- **Seamless Mock Booking Flow:**  
  A simulated booking experience showcasing the simplicity and efficiency of DocFlow.

- **Quantifiable Impact Visualization:**  
  Engaging visuals and metrics demonstrating:
  - Average waiting time reduction
  - Increased Teleconsultation adoption
 
---

## 🚀 Demo Walkthrough

Experience DocFlow through the journey of Sophie in Île-de-France:

1. **Identifying the Problem:**  
   An introductory screen presents current long wait times.
   
2. **Intelligent Triage:**  
   Sophie inputs her needs via the Patient Portal.
   
3. **Optimized Wait Times Display:**  
   The platform instantly contrasts current vs. optimized waiting times.
   
4. **Teleconsultation Recommendation:**  
   Sophie receives a prompt recommendation for a faster Teleconsultation option.
   
5. **Streamlined Booking:**  
   She completes a mock booking with ease.
   
6. **Impact Visualization:**  
   The demo wraps up with impactful metrics that highlight DocFlow’s benefits.

---

## 🛠️ Technical Stack

Built for speed, scalability, and rapid prototyping:

- **Frontend:**  
  [React](https://reactjs.org/) for a dynamic, responsive UI.
  
- **Backend:**  
  [Node.js with Express](https://expressjs.com/) for building a fast, efficient API.
  
- **AI/ML:**  
  [scikit-learn](https://scikit-learn.org/), [statsmodels](https://www.statsmodels.org/stable/index.html) for our basic waiting time prediction models.
  
- **Data Storage:**  
  [PostgreSQL](https://www.postgresql.org/) for lightweight data management.
  
- **Deployment:**  
  [Docker](https://www.docker.com/) for containerization, ensuring easy setup and scalability.
  
<br>

> [!TIP]
> **Why this stack?**  
> It supports rapid development, is easy to use, and leverages industry-standard technologies—ideal for building a functional prototype in a hackathon setting.

---

## 🔮 Future Enhancements

Looking beyond our MVP, future iterations of DocFlow will include:
- **Advanced Demand Forecasting:**  
  Employing more sophisticated AI/ML models for improved accuracy.
  
- **No-Show Risk Prediction:**  
  AI-driven insights to optimize appointment scheduling and reduce wasted slots.
  
- **Comprehensive Dashboards:**  
  Real-time views for healthcare providers and administrators to monitor performance metrics.
  
- **Intelligent Symptom-Based Triage:**  
  Integrating NLP and symptom-checker APIs for personalized triage.
  
- **Real-time Slot Optimization:**  
  Dynamic adjustment of appointment slots based on predictive demand.
  
- **Seamless EHR Integration:**  
  Direct integration with Electronic Health Records for a holistic healthcare ecosystem.

---

## 🤝 Team Nameless

  * **[Colin Peugnet]** - 
  * **[Samy Chouam]** - 
  * **[Arnaud Durand]** - 
  * **[Dimitri Abitbol]** - 
  * **[Romain Malengrez]** - 
  * **[Thibaut Tebi]** - 

## 🚀 Getting Started (Local Demo Setup)

1.  **Clone the repository:** `git clone https://github.com/copeugne/Hackathon-AISummit`
2.  **Navigate to the project directory:** `cd Hackathon-AISummit`
3.  **Run `npm run dev` to start the front-end**
4.  **Run `npm run server` to start the server**
5.  **Access the Patient Portal in your browser:** `http://localhost:5173`
6.  **Make sure the server is `healthy` with `curl -X GET http://localhost:3000/health`**

> [!TIP]
> The server port is either 5174 or 3000

## 📄 License

[MIT License](https://github.com/copeugne/Hackathon-AISummit/blob/main/LICENSE)

-----

**Let's revolutionize healthcare access with DocFlow\!** 🚀
