
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function App() {

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    gender: "",
    country: "",
    languages: []
  };

  const [form, setForm] = useState(emptyForm);

  const [students, setStudents] = useState([]);

  const [message, setMessage] = useState("");

  const [editId, setEditId] = useState("");


  // Get students when page opens
  useEffect(() => {
    loadStudents();
  }, []);


  // READ
  function loadStudents() {

    fetch(API + "/students")
      .then(response => response.json())
      .then(data => {
        setStudents(data);
      })
      .catch(error => {
        console.log(error);
        setMessage("Start the Express server first");
      });
  }


  // Text, email, password, radio and select
  function handleChange(event) {

    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value
    });
  }


  // Checkbox
  function handleLanguage(event) {

    const value = event.target.value;
    const checked = event.target.checked;

    let languages = form.languages;

    if (checked) {
      languages = [...languages, value];
    } else {
      languages = languages.filter(
        item => item !== value
      );
    }

    setForm({
      ...form,
      languages: languages
    });
  }


  // CREATE or UPDATE
  function saveStudent(event) {

    event.preventDefault();

    let url = API + "/students";

    let method = "POST";

    if (editId !== "") {

      url = API + "/students/" + editId;

      method = "PUT";
    }

    fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(form)
    })
      .then(response => response.json())
      .then(data => {

        setMessage(data.message);

        setForm(emptyForm);

        setEditId("");

        loadStudents();

      })
      .catch(error => {

        console.log(error);

        setMessage("Could not connect to Express");

      });
  }


  // EDIT
  function editStudent(student) {

    setForm({
      name: student.name,
      email: student.email,
      password: student.password,
      gender: student.gender,
      country: student.country,
      languages: student.languages
    });

    setEditId(student._id);

    setMessage("Edit the data and click Update");
  }


  // DELETE
  function deleteStudent(id) {

    fetch(API + "/students/" + id, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(data => {

        setMessage(data.message);

        loadStudents();

      });
  }


  // RESET
  function resetForm() {

    setForm(emptyForm);

    setEditId("");

    setMessage("");
  }


  return (

    <div className="page">

      <div className="form-box">

        <h1>Student Registration</h1>


        <form onSubmit={saveStudent}>

          <label>Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />


          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />


          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />


          <label>Gender</label>

          <div className="row">

            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>


            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>

          </div>


          <label>Country</label>

          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Country
            </option>

            <option value="India">
              India
            </option>

            <option value="USA">
              USA
            </option>

            <option value="UK">
              UK
            </option>

            <option value="Australia">
              Australia
            </option>

          </select>


          <label>Languages</label>

          <div className="row">

            <label>
              <input
                type="checkbox"
                value="English"
                checked={form.languages.includes("English")}
                onChange={handleLanguage}
              />
              English
            </label>


            <label>
              <input
                type="checkbox"
                value="Hindi"
                checked={form.languages.includes("Hindi")}
                onChange={handleLanguage}
              />
              Hindi
            </label>


            <label>
              <input
                type="checkbox"
                value="Telugu"
                checked={form.languages.includes("Telugu")}
                onChange={handleLanguage}
              />
              Telugu
            </label>

          </div>


          <button type="submit">
            {editId === "" ? "Register" : "Update"}
          </button>


          <button
            type="button"
            onClick={resetForm}
          >
            Reset
          </button>

        </form>


        {message && (
          <div className="message">
            {message}
          </div>
        )}

      </div>


      <div className="data-box">

        <h2>Registered Students</h2>


        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Country</th>
              <th>Languages</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {students.map(student => (

              <tr key={student._id}>

                <td>{student.name}</td>

                <td>{student.email}</td>

                <td>{student.gender}</td>

                <td>{student.country}</td>

                <td>
                  {student.languages.join(", ")}
                </td>

                <td>

                  <button
                    onClick={() => editStudent(student)}
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      deleteStudent(student._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;
