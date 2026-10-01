import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    department: "",
    doctor: "",
    appointmentDate: "",
    symptoms: "",
    terms: false,
  });

  const [registered, setRegistered] = useState(false);

  const doctors = {
    Cardiology: ["Dr. Rajesh Kumar", "Dr. Priya Sharma"],
    Neurology: ["Dr. Anil Rao", "Dr. Sneha Reddy"],
    Orthopedics: ["Dr. Ravi Kumar", "Dr. Meena Patel"],
    Dermatology: ["Dr. Arjun Singh", "Dr. Kavya Rao"],
    Pediatrics: ["Dr. Neha Sharma", "Dr. Vikram Reddy"],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "department" && { doctor: "" }),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    localStorage.setItem(
      "hospitalRegistration",
      JSON.stringify(formData)
    );

    setRegistered(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      department: "",
      doctor: "",
      appointmentDate: "",
      symptoms: "",
      terms: false,
    });

    setRegistered(false);
  };

  if (registered) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Registration Successful!</h1>

          <p>
            Your hospital appointment has been successfully registered.
          </p>

          <div className="appointment-details">
            <p>
              <strong>Patient:</strong> {formData.name}
            </p>

            <p>
              <strong>Department:</strong> {formData.department}
            </p>

            <p>
              <strong>Doctor:</strong> {formData.doctor}
            </p>

            <p>
              <strong>Appointment Date:</strong>{" "}
              {formData.appointmentDate}
            </p>
          </div>

          <button className="new-button" onClick={handleReset}>
            Register Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          🏥 MediCare
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#doctors">Doctors</a>
          <a href="#appointment">Appointment</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero" id="home">
        <div>
          <h1>
            Your Health,
            <br />
            Our Priority
          </h1>

          <p>
            Book your hospital appointment quickly and easily
            with our online registration system.
          </p>

          <a href="#appointment" className="hero-button">
            Book Appointment
          </a>
        </div>

        <div className="hero-icon">
          🏥
        </div>
      </section>

      <section className="form-section" id="appointment">
        <div className="form-card">
          <div className="form-heading">
            <h2>Hospital Appointment Registration</h2>
            <p>Enter your details to schedule an appointment</p>
          </div>

          <form onSubmit={handleSubmit}>

            <h3>Patient Information</h3>

            <div className="form-grid">

              <div className="input-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="input-group">
              <label>Gender *</label>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    required
                  />
                  Male
                </label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  Female
                </label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </div>
            </div>

            <h3>Appointment Details</h3>

            <div className="form-grid">

              <div className="input-group">
                <label>Department *</label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Department
                  </option>

                  {Object.keys(doctors).map((department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Doctor *</label>

                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  disabled={!formData.department}
                >
                  <option value="">
                    Select Doctor
                  </option>

                  {formData.department &&
                    doctors[formData.department].map(
                      (doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="input-group">
                <label>Appointment Date *</label>

                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="input-group">
              <label>Symptoms / Reason for Visit</label>

              <textarea
                name="symptoms"
                rows="4"
                placeholder="Describe your symptoms..."
                value={formData.symptoms}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="terms">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <span>
                I agree to the terms and conditions.
              </span>
            </div>

            <button type="submit" className="register-button">
              Register Appointment
            </button>

          </form>
        </div>
      </section>

      <footer id="contact">
        <h3>🏥 MediCare Hospital</h3>
        <p>Quality Healthcare | Trusted Doctors | Better Life</p>
        <p>© 2026 MediCare Hospital. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;